class UserGameProfile < DataStore::Model

  SEP = '-'.freeze

  @@resource_building_modules = {
    "quarry" => BD::Quarry,
    "lumbermill" => BD::Lumbermill
  }
  @@wedges = {
    'wedge' => BD::Wedge.new('wedge'),
    'gaddafi' => BD::Wedge.new('gaddafi')
  }
  @@building_modules = ( {
    "townhall" => BD::Townhall,
    "storage" => BD::Storage ,
    "defense_center" => BD::DefenseCenter,
    "war_factory" => BD::WarFactory,
    "house" => BD::House,
    "palm" => BD::Palm,
    "garage" => BD::Garage, 
    "defense_research" => BD::DefenseResearch,
    "military_research" => BD::MilitaryResearch
  }.merge @@resource_building_modules ).merge @@wedges

  def user
    key_parts = key.split(self.class::SEP)
    User.get(User.generate_key(key_parts.first, key_parts.last))
  end

  def init
    @data ||= { 'varsion' => { 'currnet' => 0, 'sequence' => 1},
      'townhall' => nil,
      'lumbermill' => nil,
      'quarry' => nil,
      'workers' => 1,
      'idle_workers' => 1,
      'rock' => 50000,
      'lumber' => 50000,
      'creeps' => {},
      'garage_units_used' => 0, 
      'total_garage_units'=> 0,
      'reward_bags' => {'id_generator' => 0, 'queue' => []},
      'attack_history' => {},
      'notifications' => {'id_generator' => 0, 'queue' => []},
      'attacks' => {},
      'protection' => {'started'=>0 ,'time'=> 0, 'working'=>false},
      'map' => (0..72).to_a.map{(0..24).to_a.map{0}},
      'xp_info' => {
        'xp_level' => 1,
        'energy' => 0,
        'bonus_seconds' => 0,
        'xp' => 0
      }
    }
    if self.rank.nil?
      min_rank = Game::current.ranks.first[1]
      Game::current.ranks.each_value do |rank |
        if rank['lower_exp'] < min_rank['lower_exp']   
          min_rank = rank
        end
      end
      self.rank= min_rank['name']
    end       
    BD::Research.init self
    calculate_jobs
    BD::Quest::assess_user_quests self
    save
    self.quests['descriptions'] = BD::Quest::load_quests(self)
  end

  def calculate_jobs
    building_jobs
    resource_collection_jobs
    repair_jobs
    energy_gain
    creeps_generation
    protection_jobs
    BD::Research.operate self
    last_loaded= Time.now.utc.to_i
  end
  
  def repair_buildings
    attacked= 0
    research_hp_bonus = BD::Research.total_hp_bonus( self )
    building_names = Game::current.buildings.keys
    building_names.each do |building_name|
      if(!self.building_name.nil?)
        self.building_name.each do |key, building|
          max_hp = Game.current.buildings[building_name]['levels'][building['level'].to_s]['hp']
          max_hp += research_hp_bonus * max_hp / 100
          hp = building['hp']
          if(hp < max_hp)
            self.building_name[key]['started_repairing_at'] = Time.now.utc.to_i
          end
        end
      end
    end
    return {'valid' => true, 'error' => ''}
  end
  
  def protection_jobs
    if(self.protection.nil?)
      self.protection= {'started'=>0 ,'time'=> 0,'working'=>false}
    end
    now = Time.now.utc.to_i
    if(self.protection['working'])
      if(self.protection['started'] + self.protection['started']['time'] < now)
        self.protection['working'] = false
        self.protection['started'] = 0
        self.protection['started']['time'] = 0
      end
    end
  end
  
  def creeps_generation
    now = Time.now.utc.to_i
    war_factories = self.war_factory
    if(!war_factories.nil?)
      war_factories.each_pair do |k,building|
         next if(building['state'] != BD::Building.states['NORMAL'] || building['queue']['stopped'])
         building['queue'] = {"size"=>0,"creep"=>nil,"last_creep_start"=>nil, "creep_production_time"=>nil,
         "remaining_time"=>nil} if(building['queue'].nil?)
         war_factory = BD::WarFactory.new building['coords'],self
         war_factory.process_creeps_generation
      end
    end
  end
  
  def self.generate_creep ugp, data
    war_factory_key = data['war_factory']
    wf = ugp.metadata['war_factory'][war_factory_key]
    #if(wf.nil?)return error no building
    return if(wf.nil?)
    war_factory = BD::WarFactory.new wf['coords'],ugp
    validation = war_factory.generate_creep data['creep']
    valid = validation['valid'] ?  {'valid' => true, 'error' => ''} : validation
  end
  
  def self.cancel_creep_generation ugp,data
    war_factory_key = data['war_factory']
    wf = ugp.metadata['war_factory'][war_factory_key]
    war_factory = BD::WarFactory.new wf['coords'],ugp
    validation = war_factory.cancel_creep_generation
    return validation if(!validation['valid'])
    ugp.needs_saving
    return {'valid' => true, 'error' => ''}
  end
  
  
  def energy_gain
    if( [xp_info, xp_info['xp_level'], xp_info['energy'], xp_info['bonus_seconds']].include? nil )
      xp_info['xp_level'] = 1
      xp_info['energy'] = 0
      xp_info['bonus_seconds'] = 0
    end
    uesr_xp_level = xp_info['xp_level']
    xp_level_metadata = Game::current.xp_levels[uesr_xp_level.to_s]
    max_energy = xp_level_metadata['max_helping_power']
    
    #The case of first loading a profile, he should have it full energy
    if( last_loaded.nil? )
      xp_info['energy'] = max_energy
      return
    end
    
    current_energy = xp_info['energy']
    if( current_energy >= max_energy )
      return
    end
    
    energy_unit_every = xp_level_metadata['helping_power_unit_every']
    seconds_passed = Time.now.utc.to_i - last_loaded + xp_info['bonus_seconds']
    net_energy_units = seconds_passed / energy_unit_every
    needed_energy = max_energy - current_energy
    
    if( net_energy_units >= needed_energy )
      xp_info['bonus_seconds'] = 0
      xp_info['energy'] = max_energy
      return
    end
    
    bonus_seconds = seconds_passed % energy_unit_every
    xp_info['energy'] += net_energy_units
    xp_info['bonus_seconds'] = bonus_seconds
  end
  
  def repair_jobs
    now = Time.now.utc.to_i
    repair_factor = 40
    research_hp_bonus = BD::Research.total_hp_bonus( self )
    building_names = Game::current.buildings.keys
    building_names.each do |building_name|
      if(!self.building_name.nil?)
        self.building_name.each do |key, building|
          started_repairing_at = user_game_profile.metadata[building_name][key]['started_repairing_at'] 
          if(started_repairing_at > 0)
            max_hp = @@game_metadata['buildings'][building_name]['levels'][building['level'].to_s]['hp']
            max_hp += research_hp_bonus * max_hp / 100
            hp = building['hp']
            if((max_hp-hp) < (now - started_repairing_at)*repair_factor)
              user_game_profile.metadata[building_name][key]['hp'] = max_hp
              user_game_profile.metadata[building_name][key]['started_repairing_at'] = 0
              if(user_game_profile.metadata[building_name][key]['last_collect'])
                user_game_profile.metadata[building_name][key]['last_collect'] = 
                user_game_profile.metadata[building_name][key]['last_collect'] + ((max_hp-hp)/repair_factor).round
              end
            else 
              user_game_profile.metadata[building_name][key]['hp'] = hp + (now - started_repairing_at)* repair_factor
              user_game_profile.metadata[building_name][key]['started_repairing_at'] = now
            end
          end
        end
      end
    end
    validation = {}
    validation['valid'] = true
    return validation  
  end
  
   def resource_collection_jobs
    #This is the case in the first load of user profile
    if self.last_loaded.nil?
      return
    end
    now = Time.now.utc.to_i
    #Looping on every resource building module
    @@resource_building_modules.keys.each do |resource_building_name|
      #Checking if the user have built this type of building or not yet
      if( data['resource_building_name'].present? )
        resource_building_module = @@building_modules[resource_building_name]
        resource_building = self.resource_building_name
        #Looping on every resource building instance
        resource_building.keys.each do |building_instance_coords|
          resource_building_instance = resource_building[building_instance_coords]
          next if(resource_building_instance['state'] == BD::Building.states['UPGRADING'])
          collects = resource_building_module.collects
          resource_building_level = resource_building_instance['level']
          resource_building_instance[collects] = 0 if resource_building_instance[collects].nil?
          if( resource_building_instance['assigned_workers'].present? && 
            resource_building_instance['assigned_workers'] > 0 && 
            resource_building_instance[collects] < Game::current.buildings[resource_building_name]['levels'][resource_building_level.to_s]['capacity'])
            start_resources = @@building_modules[resource_building_name].calculate_collected_resources(self, resource_building_instance, now)
            resource_building_instance[collects] += start_resources[0]+start_resources[1]
            resource_building_instance['last_collect'] = now
          end
        end
      end
    end
  end
   
  def building_jobs()
    @@building_modules.keys.each do |building_name|
      building = self.data[building_name]
      if( building.present? )
        building.keys.each do |building_instance_coords|
          coords = building[building_instance_coords]
          if ['UNDER_CONSTRUCTION', 'UPGRADING'].find{ |state| BD::Building.states[state] == coords['state'] } 
            building_job(coords, building_name , Game::current.buildings[building_name] )
          end
        end
      end
    end
  end
  
  def building_job(building, building_name, blue_prints )
    since = building['startedBuildingAt']
    now = Time.now.utc.to_i
    next_level = building['level'] + 1
    required = blue_prints['levels'][next_level.to_s]['time']
    remaining = required - (now - since)
    if( remaining <= 0 )
      building['level'] += 1
      if(building_name=="garage")
         garage = BD::Garage.new building['coords'], self
         garage.set_state BD::Building.states['NORMAL']
      else 
         building['state'] = BD::Building.states['NORMAL']
      end
      building['startedBuildingAt'] = nil
      self.idle_workers += 1
      if building.key?('last_collect')
        building['last_collect'] = now
      end
      building['remainingTime'] = 0
      Notification.new( {:metadata => data, :notification_type => "building", :notification_text => building_name + " construction is completed!"} )
    else
      building['remainingTime'] = remaining
    end
  end

  class << self

    def generate_key(*args)
      args.join(SEP)
    end    
  
  end

end

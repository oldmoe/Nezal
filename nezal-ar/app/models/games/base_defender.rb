require "json"
#require_all "#{Dir.pwd}/app/models/games/base_defender/"

class BaseDefender < Metadata
  @@speed_factor = 1
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
    "house" => BD::House
  }.merge @@resource_building_modules ).merge @@wedges
  
  @@game_metadata = nil
  
  def self.building_modules
    @@building_modules
  end
  
  def self.adjusted_game_metadata
    @@game_metadata
  end
  
  def self.new_building_specs 
    {'level' => 0, 'coords' => {'x' => nil, 'y' => nil}}
  end
  
  def self.land_marks
    {
      "grass" => 0,
      "water" => 1,
      "rock" => 2,
      "lumber" => 3
    }
  end
  
  def self.process_request (profile, data)
    data = self.decode(data)
    result = {}
    if data['request'] == 'neighbor_empire'
      result = BD::Neighbor.neighbor_empire(profile, data)
    elsif data['request'] == 'friends'
      result = BD::Neighbor.friends(profile)
    end
    return JSON.generate(result);
  end
  
  def self.convert_location( location )
    @@adjustment_size = 4
    if location.class == String
      parts = location.split(/:/)
      return parts[0].to_i, parts[1].to_i
    else
      x = location['x']
      y = location['y']
      return x.to_s.rjust( @@adjustment_size, '0' ) + ':' + y.to_s.rjust( @@adjustment_size, '0' )
    end
  end
  
  def self.calculate_jobs(user_game_profile)    
    building_jobs user_game_profile
    resource_collection_jobs user_game_profile
    repair_jobs user_game_profile
    user_game_profile.metadata['last_loaded'] = Time.now.utc.to_i
    user_game_profile.save
  end
  
  def self.repair_jobs user_game_profile
    now = Time.now.utc.to_i
    repair_factor = 40
    profile_metadata = user_game_profile.metadata
    building_names = @@game_metadata['buildings'].keys
    building_names.each do |building_name|
      if(!profile_metadata[building_name].nil?)
        profile_metadata[building_name].each do |key, building|
          started_repairing_at = user_game_profile.metadata[building_name][key]['started_repairing_at'] 
          if(started_repairing_at > 0)
            max_hp = @@game_metadata['buildings'][building_name]['levels'][building['level'].to_s]['hp']
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
  
  def self.resource_collection_jobs(user_game_profile)
    #This is the case in the first load of user profile
    if user_game_profile.metadata['last_loaded'].nil?
      return
    end
    now = Time.now.utc.to_i  
    #Looping on every resource building module
    @@resource_building_modules.keys.each do |resource_building_name|
      #Checking if the user have built this type of building or not yet
      if( user_game_profile.metadata[resource_building_name].present? )
        resource_building_module = @@building_modules[resource_building_name]
        resource_building = user_game_profile.metadata[resource_building_name]
        #Looping on every resource building instance
        resource_building.keys.each do |building_instance_coords|
          resource_building_instance = resource_building[building_instance_coords]
          collects = resource_building_module.collects
          resource_building_level = resource_building_instance['level']
          resource_building_instance[collects] = 0 if resource_building_instance[collects].nil?
          if( resource_building_instance['assigned_workers'].present? && 
            resource_building_instance['assigned_workers'] > 0 && 
            resource_building_instance[collects] < @@game_metadata['buildings'][resource_building_name]['levels'][resource_building_level.to_s]['capacity'])
            start_resources = @@building_modules[resource_building_name].calculate_collected_resources(user_game_profile, resource_building_instance,
                                                                                                       @@game_metadata , now)
            resource_building_instance[collects] += start_resources[0]+start_resources[1]
            
            resource_building_instance['last_collect'] = now
          end
        end
      end
    end
  end
  
  def self.building_jobs(user_game_profile)
    metadata = user_game_profile.metadata
    @@building_modules.keys.each do |building_name|
      if( metadata[building_name].present? )
        metadata[building_name].keys.each do |building_instance_coords|
          if(metadata[building_name][building_instance_coords]['state'] == BD::Building.states['UNDER_CONSTRUCTION'] || 
            metadata[building_name][building_instance_coords]['state'] == BD::Building.states['UPGRADING'])
            building_job(user_game_profile, metadata[building_name][building_instance_coords], building_name , @@game_metadata['buildings'][building_name] )
          end
        end
      end
    end
  end
  
  def self.building_job(user_game_profile, building, building_name, blue_prints )
    metadata = user_game_profile.metadata
    since = building['startedBuildingAt']
    now = Time.now.utc.to_i
    next_level = building['level'] + 1
    required = blue_prints['levels'][next_level.to_s]['time']
    remaining = required - (now - since)
    if( remaining <= 0 )
      building['level'] += 1
      building['state'] = BD::Building.states['NORMAL']
      building['startedBuildingAt'] = nil
      metadata['idle_workers'] += 1
      if @@building_modules[building_name].respond_to? 'assign_worker'
        #        @@building_modules[building_name].assign_worker(user_game_profile, building['coords']) 
      end
      Notification.new( {:metadata => metadata, :notification_type => "building", :notification_text => building_name + " construction is completed!"} )
      
    else
      building['remainingTime'] = remaining
    end
  end
  
  def self.initialize_game_metadata( game )
    #Applying Speed Factor!
    @@building_modules.keys.each do |building_name|
      building_levels = game.metadata['buildings'][building_name]['levels']
      building_levels.keys.each do |level|
        building_levels[level]['time'] /= @@speed_factor
        building_levels[level]['unit_per_worker_minute'] *= @@speed_factor if building_levels[level]['unit_per_worker_minute']
      end
    end
    game.metadata
  end
  
  def self.load_game(game)
    @@game_metadata = initialize_game_metadata game || {}
  end
  
  def self.init_quest(quest)
    BD::Quest::init_quest(quest)
  end
  
  def self.edit_quest(quest, data)
    BD::Quest::edit_quest(quest, data)
  end
  
  def self.load_game_profile(user_game_profile)
    #reading a -maybe- attached error message from the object and porting it to the metadata!
    if(user_game_profile['error'])
      origin = user_game_profile.metadata
      origin['error'] = user_game_profile['error']
      user_game_profile.metadata= origin
    end
    @@game_metadata = initialize_game_metadata user_game_profile.game
    BD::Research.init user_game_profile
    calculate_jobs user_game_profile
    BD::Quest::assess_user_quests user_game_profile
    #### TODO We need to check why they need the stringified one 
    #### and see what we gonna do about that
    user_game_profile.metadata || {}
  end
  
  def self.edit_game_profile(user_game_profile, data)
    data = self.decode(data)
    if data['event'] == 'upgrade'
      validation = upgrade_building(user_game_profile, data)
    elsif data['event'] == 'move' 
      validation = move_building(user_game_profile, data)
    elsif data['event'] == 'buy_worker'
      validation = buy_worker(user_game_profile)
    elsif data['event'] == 'assign_worker'
      validation = assign_worker(user_game_profile, data)
    elsif data['event'] == 'collect_resources'
      validation = collect_building(user_game_profile, data)
    elsif data['event'] == 'notification_ack'
      validation = Notification.delete({:profile => user_game_profile, :id => data['id']})
    elsif data['event'] == 'attack'
      repair_jobs user_game_profile
      validation = simulate_attack user_game_profile, data['creeps']
    elsif data['event'] == 'repair_buildings'
      validation = repair_buildings user_game_profile  
    end
    
    user_game_profile['error'] = validation['error'] unless validation['valid']
    BD::Quest::assess_user_quests user_game_profile
    #### TODO We need to check why they need the stringified one 
    #### and see what we gonna do about that
    user_game_profile.metadata || {}
  end
  
  def self.repair_buildings user_game_profile
    user_game_profile.metadata['attacked'] = 0
    profile_metadata = user_game_profile.metadata
    building_names = @@game_metadata['buildings'].keys
    building_names.each do |building_name|
      if(!profile_metadata[building_name].nil?)
        profile_metadata[building_name].each do |key, building|
          max_hp = @@game_metadata['buildings'][building_name]['levels'][building['level'].to_s]['hp']
          hp = building['hp']
          if(hp < max_hp)
            user_game_profile.metadata[building_name][key]['started_repairing_at'] = Time.now.utc.to_i
          end
        end
      end
    end
    return {'valid' => true, 'error' => ''}
  end
  
  def self.simulate_attack user_game_profile, creeps_coords
    profile_metadata = user_game_profile.metadata
    map = BD::Map.new profile_metadata['map']
    building_names = @@game_metadata['buildings'].keys
    creeps = []
    i=0
    creeps_coords.each do |creep|
      creep_class = eval("BD::"+creep['type'])
      creeps.push(creep_class.new(map,creep['x'],creep['y'],i,@@game_metadata))
      i = i+1
    end
    weapons = []
    building_names.each do |building_name|
      if(!profile_metadata[building_name].nil?)
        profile_metadata[building_name].values.each do |building|
          display = @@game_metadata['buildings'][building_name]['levels'][building['level'].to_s]['display']
          options = {
            'xdim' => display['xdim'],
            'ydim' => display['ydim'],
            'zdim' => display['zdim'],
            'img_width' => display['imgWidth'],
            'img_height' => display['imgHeight'],
            'hp' => building['hp']
          }
          map_building = BD::MapBuilding.new building, building_name, options
          map.add_element map_building
          if @@wedges[building_name]
            weapons << BD::Weapon.new(map_building, creeps.clone)
          end
        end
      end
    end
    done = false
    weapons.each do |weapon|
      weapon.tick
    end
    weapons.each do |weapon|
      weapon.display_tick
    end
    while(!done)
      done = true
      weapons.each do |weapon|
        weapon.tick
      end
      creeps.each do |creep|
        if(!creep.done_attack)
          done=false
          creep.tick
        end
      end
      weapons.each do |weapon|
        weapon.display_tick
      end
    end
    puts "=====================FINISHED========================="
    map.objects.each do |obj|
      puts "#{obj.name}  #{obj.hp}"
      key = self.convert_location(obj.owner['coords'])
      user_game_profile.metadata[obj.name][key]['hp'] = obj.hp
    end
    return {'valid' => true, 'error' => ''}
  end
  
  def self.buy_worker(user_game_profile)
    return BD::WorkerFactory.buy_worker(user_game_profile);
  end
  
  # {'building' : 'lumbermill', 'coords' : {'x':'', 'y':''} }
  def self.assign_worker(user_game_profile, data)
    name = data['building']
    return @@building_modules[name].assign_worker(user_game_profile, data['coords'])
  end
  
  # {'building' : 'townhall', 'coords' : {'x':'', 'y':''} }
  def self.upgrade_building(user_game_profile, data)
    building = data['building']
    coords = data['coords']
    name = data['building']
    building = user_game_profile.metadata[name]
    location = self.convert_location(coords)
    if building.nil? || building[location].nil?
      validation = @@building_modules[name].build(user_game_profile, data['coords'])
      return validation
    else
      validation = @@building_modules[name].upgrade(user_game_profile, data['coords'])
      return validation
    end
    
  end
  
  def self.collect_building(user_game_profile, data)
    building = data['building']
    coords = data['coords']
    @@building_modules[building].collect(user_game_profile, coords)
  end
  
  def self.move_building(user_game_profile, data)
    name = data['building']
    validation = @@building_modules[name].move(user_game_profile, name, data['coords'], data['oldCoords'])
    return validation
  end
  
  def self.init_game_profile(user_game_profile)
    user_game_profile.metadata= 
    {'townhall' => nil,
                   'lumbermill' => nil,
                   'quarry' => nil,
                   'workers' => 1,
                   'idle_workers' => 1,
                   'rock' => 20000,
                   'lumber' => 20000,
                   'notifications' => {'id_generator' => 0, 'queue' => []},
                   'map' => (0..72).to_a.map{(0..24).to_a.map{0}}
    }
  end
end

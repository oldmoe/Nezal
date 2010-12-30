require "json"
#require_all "#{Dir.pwd}/app/models/games/base_defender/"

class BaseDefender < Metadata
  @@speed_factor = 3
  @@resource_building_modules = {
    "quarry" => BD::Quarry,
    "mine" => BD::Mine
  }
  @@building_modules = {
    "townhall" => BD::Townhall 
  }.merge @@resource_building_modules
  
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
      "iron" => 3
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
    user_game_profile.metadata['last_loaded'] = Time.now.utc.to_i
    user_game_profile.save
  end
  
  def self.resource_collection_jobs(user_game_profile)
    #This is the case in the first load of user profile
    if user_game_profile.metadata['last_loaded'].nil?
      return
    end
   
    resources_collected = {}
    now = Time.now.utc.to_i
    seconds_passed_since_last_load = now - user_game_profile.metadata['last_loaded']
    
    #Looping on every resource building module
    @@resource_building_modules.keys.each do |resource_building_name|
      #Checking if the user have built this type of building or not yet
      if( user_game_profile.metadata[resource_building_name].present? )
        resource_building_module = @@building_modules[resource_building_name]
        resource_building = user_game_profile.metadata[resource_building_name]
        #Looping on every resource building instance
        resource_building.keys.each do |building_instance_coords|
          resource_building_instance = resource_building[building_instance_coords]
          #Checking if there is any worker assigned to the building
          if( resource_building_instance['assigned_workers'].present? && resource_building_instance['assigned_workers'] > 0 )
            resource_building_level = resource_building_instance['level']
            assigned_workers = resource_building_instance['assigned_workers']
            unit_per_worker_minute = @@game_metadata['buildings'][resource_building_name]['levels'][resource_building_level.to_s]['unit_per_worker_minute']
            total_per_minute = unit_per_worker_minute * assigned_workers
            collects = resource_building_module.collects
            resources_collected[collects] = 0 if resources_collected[collects].nil?
            resources_collected[collects] += ((total_per_minute/60.0) * seconds_passed_since_last_load).round
          end
        end
      end
    end
    
    resources_collected.keys.each do |resource|
      user_game_profile.metadata[resource] += resources_collected[resource]
    end
    
  end
  
  def self.building_jobs(user_game_profile)
    metadata = user_game_profile.metadata
    @@building_modules.keys.each do |building_name|
      if( metadata[building_name].present? )
        metadata[building_name].keys.each do |building_instance_coords|
          if(metadata[building_name][building_instance_coords]['state'] == BD::Building.states['UNDER_CONSTRUCTION'])
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
        @@building_modules[building_name].assign_worker(user_game_profile, building['coords']) 
      end
      Notification.new( {:metadata => metadata, :notification_type => "building", :notification_text => building_name + " construction is completed!"} )
      
    else
      building['remainingTime'] = remaining
    end
  end
  
  def self.initialize_game_metadata( game )
    #Applying Speed Factor!
    @@building_modules.keys.each do |building_name|
      puts building_name
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
    elsif data['event'] == 'buy_worker'
      validation = buy_worker(user_game_profile)
    elsif data['event'] == 'assign_worker'
      validation = assign_worker(user_game_profile, data)
    elsif data['event'] == 'notification_ack'
      validation = Notification.delete({:profile => user_game_profile, :id => data['id']})
    end
    user_game_profile['error'] = validation['error'] unless validation['valid']
    BD::Quest::assess_user_quests user_game_profile
    #### TODO We need to check why they need the stringified one 
    #### and see what we gonna do about that
    user_game_profile.metadata || {}
  end
  
  def self.buy_worker(user_game_profile)
    return BD::WorkerFactory.buy_worker(user_game_profile);
  end
  
  # {'building' : 'mine', 'coords' : {'x':'', 'y':''} }
  def self.assign_worker(user_game_profile, data)
    name = data['building']
    return @@building_modules[name].assign_worker(user_game_profile, data['coords'])
  end
  
  # {'building' : 'townhall', 'coords' : {'x':'', 'y':''} }
  def self.upgrade_building(user_game_profile, data)
    
    building = data['building']
    
    name = data['building']
    building = user_game_profile.metadata[name]
    if building.nil? || building[building].nil?
      validation = @@building_modules[name].build(user_game_profile, data['coords'])
      return validation
    else
      validation = @@building_modules[name].upgrade(user_game_profile, data['coords'])
      return validation
    end
    
  end
  
  def self.init_game_profile(user_game_profile)
    user_game_profile.metadata= 
                  {'townhall' => nil,
                   'mine' => nil,
                   'quarry' => nil,
                   'workers' => 1,
                   'idle_workers' => 1,
                   'rock' => 15000,
                   'iron' => 15000,
                   'notifications' => {'id_generator' => 0, 'queue' => []},
                   'map' => [
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                            ]
                  }
  end
end

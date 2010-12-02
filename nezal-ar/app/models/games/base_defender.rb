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
    if data['request'] == 'neighbour_empire'
      user_id = data['user_id']
      neighbour_user_profile = UserGameProfile.where('game_id'=> profile.game.id, 'user_id'=> user_id).first
      load_game_profile( neighbour_user_profile )
      result = { 
      :user_data => { :rank => neighbour_user_profile.rank.name,
                      :exp => neighbour_user_profile.exp, 
                      :newbie => neighbour_user_profile.newbie,
                      :locale => neighbour_user_profile.locale, 
                      :metadata => neighbour_user_profile.metadata
                    }
      }
    elsif data['request'] == 'friends'
      
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
    user_game_profile.metadata = JSON.parse(user_game_profile.metadata)
    
    building_jobs user_game_profile
    resource_collection_jobs user_game_profile
  
    user_game_profile.metadata['last_loaded'] = Time.now.utc.to_i
    user_game_profile.metadata = self.encode(user_game_profile.metadata)
    user_game_profile.save
  end
  
  def self.resource_collection_jobs(user_game_profile)
    metadata = user_game_profile.metadata
    
    #This is the case in the first load of user profile
    if metadata['last_loaded'].nil?
      return
    end
    
    resources_collected = {}
    now = Time.now.utc.to_i
    seconds_passed_since_last_load = now - metadata['last_loaded']
    
    #Looping on every resource building module
    @@resource_building_modules.keys.each do |resource_building_name|
      #Checking if the user have built this type of building or not yet
      if( metadata[resource_building_name].present? )
        resource_building_module = @@building_modules[resource_building_name]
        resource_building = metadata[resource_building_name]
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
      metadata[resource] += resources_collected[resource]
    end
    
  end
  
  def self.building_jobs(user_game_profile)
    metadata = user_game_profile.metadata
    @@building_modules.keys.each do |building|
      if( metadata[building].present? )
        metadata[building].keys.each do |building_instance_coords|
          if(metadata[building][building_instance_coords]['inProgress'])
            building_job(user_game_profile, metadata[building][building_instance_coords], @@game_metadata['buildings'][building] )
          end
        end
      end
    end
  end
  
  def self.building_job(user_game_profile, building, blue_prints )
    metadata = user_game_profile.metadata
    since = building['startedBuildingAt']
    now = Time.now.utc.to_i
    next_level = building['level'] + 1
    required = blue_prints['levels'][next_level.to_s]['time']
    remaining = required - (now - since)
    if( remaining <= 0 )
      building['level'] += 1
      building['inProgress'] = false
      building['startedBuildingAt'] = nil
      metadata['idle_workers'] += 1
    else
      building['remainingTime'] = remaining
    end
  end
  
  def self.initialize_game_metadata( game )
    game_metadata = self.decode(game.metadata)
    
    #Applying Speed Factor!
    @@building_modules.keys.each do |building_name|
      building_levels = game_metadata['buildings'][building_name]['levels']
      building_levels.keys.each do |level|
        building_levels[level]['time'] /= @@speed_factor
        building_levels[level]['unit_per_worker_minute'] *= @@speed_factor if building_levels[level]['unit_per_worker_minute']
      end
    end
    
    game_metadata
  end
  
  def self.load_game(game)
    @@game_metadata = initialize_game_metadata game || "{}"
  end
  
  def self.load_game_profile(user_game_profile)
    #reading a -maybe- attached error message from the object and porting it to the metadata!
    if(user_game_profile['error'])
      origin = self.decode(user_game_profile.metadata)
      origin['error'] = user_game_profile['error']
      user_game_profile.metadata = self.encode(origin)
    end
    
    @@game_metadata = initialize_game_metadata user_game_profile.game
    calculate_jobs user_game_profile
    user_game_profile.metadata || "{}"
  end
  
  def self.edit_game_profile(user_game_profile, data)
    data = self.decode(data)
    if data['event'] == 'upgrade'
      validation = upgrade_building(user_game_profile, data)
    elsif data['event'] == 'buy_worker'
      validation = buy_worker(user_game_profile)
    elsif data['event'] == 'assign_worker'
      validation = assign_worker(user_game_profile, data)
    elsif data['event'] == 'neighbours'
      return neighbours(user_game_profile).to_s
    end
    user_game_profile['error'] = validation['error'] unless validation['valid']
    user_game_profile.metadata || "{}"
  end
  
  def self.neighbours(user_game_profile)
    all_game_profiles = UserGameProfile.find_all_by_game_id(user_game_profile.game.id).collect{|profile| profile.user_id}
    return all_game_profiles - [user_game_profile.user.id]
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
    profile_data = self.decode(user_game_profile.metadata)
    
    name = data['building']
    building = profile_data[name]
    if building.nil? || building[building].nil?
      validation = @@building_modules[name].build(user_game_profile, data['coords'])
      return validation
    else
      validation = @@building_modules[name].upgrade(user_game_profile, data['coords'])
      return validation
    end
    
  end
  
  def self.init_game_profile(user_game_profile)
    user_game_profile.metadata= self.encode(
                  {'townhall' => nil,
                   'mine' => nil,
                   'quarry' => nil,
                   'workers' => 1,
                   'idle_workers' => 1,
                   'rock' => 100,
                   'iron' => 100,
                   'map' => [
                              [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,1,1,1,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,1,1,1,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,2,2,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,2,2,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                            ]
                  })
  end
end

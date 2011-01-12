module BD
  class ResourceBuilding < Building
    def self.collects
      @collect
    end

    def self.collect(user_game_profile, coords)
      game_metadata = user_game_profile.game.metadata
      location_hash = BaseDefender.convert_location(coords)
      building = user_game_profile.metadata[@name][location_hash]
      time = Time.now.utc.to_i
      collected_resources = self.calculate_collected_resources(building, game_metadata, time)
      building[self.collects] += collected_resources
      user_game_profile.metadata[@collect]= building[self.collects] + user_game_profile.metadata[@collect]
      user_game_profile.metadata[@name][location_hash][self.collects] = 0
      user_game_profile.metadata[@name][location_hash]['last_collect'] = time
      user_game_profile.save
      return validate_collect( user_game_profile.metadata, game_metadata, location_hash)
    end

    def self.calculate_collected_resources(building, game_metadata, time_now)
      time_now = time_now
      building_collected_resources =  building[self.collects] || 0 
      last_collect_time =  building['last_collect'] || time_now 
      collecting_time = time_now - last_collect_time
      assigned_workers = building['assigned_workers']
      building_capacity = game_metadata['buildings'][@name]['levels'][building['level'].to_s]['capacity']
      unit_per_worker_minute = game_metadata['buildings'][@name]['levels'][building['level'].to_s]['unit_per_worker_minute']
      total_per_minute = unit_per_worker_minute * assigned_workers
      collected = ((total_per_minute/60.0) * collecting_time).round
      if (building_collected_resources + collected) > building_capacity
        collected = building_capacity - building_collected_resources
      end
      return collected
    end
    
    def self.assign_worker(user_game_profile, coords)
      location_hash = BaseDefender.convert_location(coords)
      game_metadata = BaseDefender.adjusted_game_metadata
      
      validation = validate_worker_assignment(user_game_profile.metadata, game_metadata, location_hash)
      return validation if validation['valid'] == false
      
      current_level = user_game_profile.metadata[@name][location_hash]['level'].to_s
      assigned_workers = user_game_profile.metadata[@name][location_hash]['assigned_workers'] || 0
      
      user_game_profile.metadata['idle_workers'] -= 1
      user_game_profile.metadata[@name][location_hash]['assigned_workers'] = assigned_workers + 1
      
      user_game_profile.save
      
      return validation
    end
    
    def self.validate_worker_assignment(user_profile_metadata, game_metadata, location_hash)
      assigned_workers = user_profile_metadata[@name][location_hash]['assigned_workers'] || 0
      current_level = user_profile_metadata[@name][location_hash]['level'].to_s
      max_workers = game_metadata['buildings'][@name]['levels'][current_level]['max_workers']
      
      if(user_profile_metadata['idle_workers'] == 0)
        return {'valid' => false,
                'error' => "Not enough workers, all your workers are busy"}
      end
      
      if(assigned_workers >= max_workers)
        return {'valid' => false,
                'error' => "Cannot assign more workers, please upgrade the " + @name + " first!"}
      end
      
      return {'valid' => true, 'error' => ''}
      
    end
    
    def self.validate_collect(user_profile_metadata, game_metadata, location_hash)
      return {}
    end

  end
end

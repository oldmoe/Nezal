module BD
  class ResourceBuilding < Building
    def self.collects
      @collect
    end
    
    def self.assign_worker(user_game_profile, coords)
      user_profile_metadata = JSON.parse(user_game_profile.metadata)
      location_hash = BaseDefender.convert_location(coords)
      game_metadata = BaseDefender.adjusted_game_metadata
      
      validation = validate_worker_assignment(user_profile_metadata, game_metadata, location_hash)
      return validation if validation['valid'] == false
      
      current_level = user_profile_metadata[@name][location_hash]['level'].to_s
      assigned_workers = user_profile_metadata[@name][location_hash]['assigned_workers'] || 0
      
      user_profile_metadata['idle_workers'] -= 1
      user_profile_metadata[@name][location_hash]['assigned_workers'] = assigned_workers + 1
      
      user_game_profile.metadata = BaseDefender.encode(user_profile_metadata)
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
  end
end
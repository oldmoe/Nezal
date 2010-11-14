module BD
  class Building
    class << self
      def build(user_game_profile, coords)
        user_profile_metadata = JSON.parse(user_game_profile.metadata)
        game_metadata = BaseDefender.adjusted_game_metadata
        location_hash = BaseDefender.convert_location(coords)
        
        validation = validateBuilding(user_profile_metadata, game_metadata, coords)
        return validation if validation['valid'] == false
        
        user_profile_metadata['idle_workers'] -= 1
        user_profile_metadata[@name] = {} if user_profile_metadata[@name].nil?
        user_profile_metadata[@name][location_hash] = BaseDefender.new_building_specs
        user_profile_metadata[@name][location_hash]['startedBuildingAt'] = Time.now.utc.to_i
        user_profile_metadata[@name][location_hash]['inProgress'] = true
        
        user_profile_metadata[@name][location_hash]['coords'] = coords
        
        user_profile_metadata['rock'] -= game_metadata['buildings'][@name]['levels']['1']['rock']
        user_profile_metadata['iron'] -= game_metadata['buildings'][@name]['levels']['1']['iron']
        
        user_game_profile.metadata = BaseDefender.encode(user_profile_metadata)
        user_game_profile.save
        
        return validation
      end
      
      def validateBuilding(user_profile_metadata, game_metadata, coords)
        #validating workers
        if( user_profile_metadata['idle_workers'] == 0 )
          return { 'valid' => false,
                   'error' => "There is no idle workers to build the " + @name}
        end
  
        #validating resources
        neededRock = game_metadata['buildings'][@name]['levels']['1']['rock'] - user_profile_metadata['rock'];
        neededIron = game_metadata['buildings'][@name]['levels']['1']['iron'] - user_profile_metadata['iron'];
        if( neededRock > 0 && neededIron > 0 )
          return {'valid' => false,
                  'error' => "Not enough resources, you need more "+ neededRock +" rock and "+ neededIron + " iron"}
        end
        
        if( neededRock > 0)
          return {'valid' => false,
                  'error' => "Not enough resources, you need more " + neededRock + " rock"}
        end
        
        if( neededIron > 0)
          return {'valid' => false,
                  'error' => "Not enough resources, you need more " + neededIron + " rock"}
        end
        
        #validating location
        puts "user_profile_metadata['map'][coords['x']][coords['y']] : " + user_profile_metadata['map'][coords['x']][coords['y']].to_s
        puts "BaseDefender.land_marks[@can_be_built_on] : " + BaseDefender.land_marks[@can_be_built_on].to_s
        puts "coords['x'] : " + coords['x'].to_s
        puts "coords['y'] : " + coords['y'].to_s
        
        if(user_profile_metadata['map'][coords['y']][coords['x']] != BaseDefender.land_marks[@can_be_built_on])
          return {'valid' => false,
                  'error' => @name + " can be built on "+ @can_be_built_on +" only!"}
        end
        
        return {'valid' => true, 'error' => ''}
      end
    
      def upgrade(user_game_profile, coords)
        puts "upgrading " + @name
      end
    end
  end
end

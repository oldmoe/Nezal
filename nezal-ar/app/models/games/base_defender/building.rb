module BD
  class Building
    @@states = { 
                 'NOT_PLACED' => 0,
                 'UNDER_CONSTRUCTION' => 1,
                 'UPGRADING' => 2,
                 'NORMAL' => 3 
                }
    class << self
      def states
        @@states
      end
      def build(user_game_profile, coords)
        game_metadata = BaseDefender.adjusted_game_metadata
        location_hash = BaseDefender.convert_location(coords)
        
        validation = validateBuilding(user_game_profile.metadata, game_metadata, coords)
        return validation if validation['valid'] == false
        
        user_game_profile.metadata['idle_workers'] -= 1
        user_game_profile.metadata[@name] = {} if user_game_profile.metadata[@name].nil?
        user_game_profile.metadata[@name][location_hash] = BaseDefender.new_building_specs
        user_game_profile.metadata[@name][location_hash]['startedBuildingAt'] = Time.now.utc.to_i
        user_game_profile.metadata[@name][location_hash]['state'] = states['UNDER_CONSTRUCTION']
        user_game_profile.metadata[@name][location_hash]['coords'] = coords
        
        user_game_profile.metadata['rock'] -= game_metadata['buildings'][@name]['levels']['1']['rock']
        user_game_profile.metadata['lumber'] -= game_metadata['buildings'][@name]['levels']['1']['lumber']
        
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
        neededLumber = game_metadata['buildings'][@name]['levels']['1']['lumber'] - user_profile_metadata['lumber'];
        if( neededRock > 0 && neededLumber > 0 )
          return {'valid' => false,
                  'error' => "Not enough resources, you need more "+ neededRock +" rock and "+ neededLumber + " lumber"}
        end
        
        if( neededRock > 0)
          return {'valid' => false,
                  'error' => "Not enough resources, you need more " + neededRock + " rock"}
        end
        
        if( neededLumber > 0)
          return {'valid' => false,
                  'error' => "Not enough resources, you need more " + neededLumber + " rock"}
        end
        
        #validating location # to be reconsidered  after server Map implementation
#        puts "user_profile_metadata['map'][coords['x']][coords['y']] : " + user_profile_metadata['map'][coords['x']][coords['y']].to_s
#        puts "BaseDefender.land_marks[@can_be_built_on] : " + BaseDefender.land_marks[@can_be_built_on].to_s
#        puts "coords['x'] : " + coords['x'].to_s
#        puts "coords['y'] : " + coords['y'].to_s
#        
#        if(user_profile_metadata['map'][coords['y']][coords['x']] != BaseDefender.land_marks[@can_be_built_on])
#          return {'valid' => false,
#                  'error' => @name + " can be built on "+ @can_be_built_on +" only!"}
#        end
        
        return {'valid' => true, 'error' => ''}
      end
    
      def upgrade(user_game_profile, coords)
        puts "upgrading " + @name
      end

    end
  end
end

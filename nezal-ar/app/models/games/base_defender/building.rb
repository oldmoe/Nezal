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
        #x = game_metadata['buildings']
        #y = x[@name]
        #z = y[]
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
      
      def move(user_game_profile, name, coords, old_coords)
        coords_str = BaseDefender.convert_location(coords)
        old_coords_str = BaseDefender.convert_location(old_coords)
        building = user_game_profile.metadata[name].delete(old_coords_str)
        if building.present?
          building['coords'] = coords
          user_game_profile.metadata[name][coords_str] = building
        else
          return {'valid' => false, 'error' => "There is no #{name} in this location"}
        end
        return {'valid' => true, 'error' => ''}
      end

      def upgrade(user_game_profile, coords)
        location_hash = BaseDefender.convert_location(coords)
        game_metadata = BaseDefender.adjusted_game_metadata
        
        validation = validateBuilding(user_game_profile.metadata, game_metadata, coords)
        return validation if validation['valid'] == false      

        user_game_profile.metadata['idle_workers'] -= 1
        user_game_profile.metadata[@name][location_hash]['startedBuildingAt'] = Time.now.utc.to_i
        user_game_profile.metadata[@name][location_hash]['state'] = states['UPGRADING']
        user_game_profile.metadata[@name][location_hash]['coords'] = coords
        
        user_game_profile.metadata['rock'] -= game_metadata['buildings'][@name]['levels']['1']['rock']
        user_game_profile.metadata['lumber'] -= game_metadata['buildings'][@name]['levels']['1']['lumber']
        
        user_game_profile.save
        puts "upgrading " + @name
        return validation
      end

      def validate_upgrade(user_profile_metadata, game_metadata, coords)
        return validation if validation['valid'] == false
        #validating workers
        if( user_profile_metadata['idle_workers'] == 0 )
          return { 'valid' => false,
                   'error' => "There is no idle workers to build the " + @name}
        end
        
        #make sure the building we are attempting to upgrade exists
        if( !user_game_profile.metadata[@name][location_hash] )
          return {'valid' => false,
                  'error' => "The building you are trying to upgrade doesn't exist"}
        end
        #validating there is a next level to upgrade too, validate the user has enough resources.
        current_level = user_game_profile.metadata[@name][location_hash]['level']
        if( game_metadata['buildings'][@name]['levels'][(current_level+1).to_s] )
          neededRock = game_metadata['buildings'][@name]['levels'][(current_level+1).to_s]['rock'] - user_profile_metadata['rock'];
          neededLumber = game_metadata['buildings'][@name]['levels'][(current_level+1).to_s]['lumber'] - user_profile_metadata['lumber'];
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
          # TODO : In here should come a part to check the dependency chain.
          # make sure that the user have met the conditions required for that upgrade.
        else
          return {'valid' => false,
                  'error' => "Max upgrade level reached"}
        end

        return {'valid' => true, 'error' => ''}
      end

    end
  end
end

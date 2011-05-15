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

      def neighbor_data
        []
      end

      def build(user_game_profile, coords, name=nil)
        building_name = name || @name
        game_metadata = BaseDefender.adjusted_game_metadata
        location_hash = BaseDefender.convert_location(coords)
        
        validation = validate_building(user_game_profile.metadata, game_metadata, coords, building_name)
        return validation if validation['valid'] == false
        
        user_game_profile.metadata['idle_workers'] -= 1
        user_game_profile.metadata[building_name] = {} if user_game_profile.metadata[building_name].nil?
        user_game_profile.metadata[building_name][location_hash] = BaseDefender.new_building_specs
        user_game_profile.metadata[building_name][location_hash]['startedBuildingAt'] = Time.now.utc.to_i
        user_game_profile.metadata[building_name][location_hash]['started_repairing_at'] = 0
        user_game_profile.metadata[building_name][location_hash]['state'] = states['UNDER_CONSTRUCTION']
        user_game_profile.metadata[building_name][location_hash]['coords'] = coords
        user_game_profile.metadata[building_name][location_hash]['hp'] = game_metadata['buildings'][building_name]['levels']['1']['hp']
        user_game_profile.metadata['rock'] -= game_metadata['buildings'][building_name]['levels']['1']['rock']
        user_game_profile.metadata['lumber'] -= game_metadata['buildings'][building_name]['levels']['1']['lumber']
        
        user_game_profile.save
        
        return validation
      end
      
      def validate_building(user_profile_metadata, game_metadata, coords, name=nil)
        building_name = name || @name
        #validating workers
        if( user_profile_metadata['idle_workers'] == 0 )
          return { 'valid' => false,
                   'error' => "There is no idle workers to build the " + building_name}
        end
  
        #validating resources
        #x = game_metadata['buildings']
        #y = x[@name]
        #z = y[]
        neededRock = game_metadata['buildings'][building_name]['levels']['1']['rock'] - user_profile_metadata['rock'];
        neededLumber = game_metadata['buildings'][building_name]['levels']['1']['lumber'] - user_profile_metadata['lumber'];
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
        #validating dependencies
        dependencies_valid = validate_dependencies user_profile_metadata, game_metadata, building_name, '1'
        if(!dependencies_valid['valid'])
          return dependencies_valid
        end
        max_no_valid = validate_max_no_of_buildings user_profile_metadata, game_metadata, building_name, '1'
        if(!max_no_valid['valid'])
          return max_no_valid
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
      
      def validate_dependencies user_profile_metadata, game_metadata, building_name, level
        building_dependencies = game_metadata['buildings'][building_name]['levels'][level]['dependency']['buildings']
        building_dependencies.each do |key,value|
          found = false
          user_profile_metadata[key].values.each do |building|
            if(building['level'] >= value.to_i)
              found = true
              break
            end
          end
          if(!found)
            return {'valid' => false,
                  'error' => "Cannot build " + building_name + ", you need a "+ key.gsub('_',' ').capitalize + " level "+value }
          end
        end 
        return {'valid' => true, 'error'=>''}
      end
      
      def validate_max_no_of_buildings user_profile_metadata, game_metadata, building_name, level
        limiting_building = game_metadata['buildings'][building_name]['levels'][level]['limited_by']
        if(!limiting_building.nil?)
          max_level = 0 
          registery = user_profile_metadata[limiting_building]
          if(registery.nil?)
                return {'valid' => false,
                  'error' => "Cannot build " + building_name + ", you need a "+ limiting_building.gsub('_',' ').capitalize }
          end
          registery.each do |key, value|
            max_level = value['level'] if(value['level']>max_level)
          end
          if(max_level > 0)
            max_no_of_buildings = game_metadata['buildings'][limiting_building]['levels'][max_level.to_s]['limiting']['others'][building_name].to_i
            if(max_no_of_buildings.nil?)
              max_no_of_buildings = game_metadata['buildings'][limiting_building]['levels'][max_level.to_s]['limiting']['global'].to_i
            end
            if(!user_profile_metadata[building_name].nil? && max_no_of_buildings<=user_profile_metadata[building_name].size)
              return {'valid' => false,
                  'error' => "Cannot build more than #{user_profile_metadata[building_name].size} #{building_name}."}
            end
          else
             return {'valid' => false,
                  'error' => "You can only build " + max_no_of_buildings + " " + building_name.gsub('_',' ').capitalize}
          end
        end
        return {'valid' => true, 'error'=>''}
      end
      
      def move(user_game_profile, name, coords, old_coords)
        coords_str = BaseDefender.convert_location(coords)
        old_coords_str = BaseDefender.convert_location(old_coords)
        building = user_game_profile.metadata[name].delete(old_coords_str)
        if building.present?
          building['coords'] = coords
          user_game_profile.metadata[name][coords_str] = building
          return {'valid' => true, 'error' => ''}
        else
          return {'valid' => false, 'error' => "There is no #{name} in this location"}
        end
      end

      def upgrade(user_game_profile, coords, name=nil)
        building_name = name || @name
        location_hash = BaseDefender.convert_location(coords)
        game_metadata = user_game_profile.game.metadata
        user_metadata = user_game_profile.metadata
        validation = validate_upgrade(user_metadata, game_metadata, coords, building_name)
        return validation if validation['valid'] == false      
        building = user_game_profile.metadata[building_name][location_hash]
        current_level = building['level']
        
        user_metadata['idle_workers'] -= 1
        building['startedBuildingAt'] = Time.now.utc.to_i
        building['state'] = states['UPGRADING']
        building['coords'] = coords
        building_level_info = game_metadata['buildings'][building_name]['levels'][(current_level+1).to_s]
        building['hp'] = building_level_info['hp']      
        user_metadata['rock'] -= building_level_info['rock']
        user_metadata['lumber'] -= building_level_info['lumber']
          
        user_game_profile.save
        puts "upgrading " + building_name
        return validation
      end

      def validate_upgrade(user_profile_metadata, game_metadata, coords, name=nil)
        building_name = name || @name
        #validating workers
        if( user_profile_metadata['idle_workers'] == 0 )
          return { 'valid' => false,
                   'error' => "There is no idle workers to build the " + building_name}
        end
        
        #make sure the building we are attempting to upgrade exists
        location_hash = BaseDefender.convert_location(coords)
        if( !user_profile_metadata[building_name][location_hash] )
          return {'valid' => false,
                  'error' => "The building you are trying to upgrade doesn't exist"}
        end
        #validating there is a next level to upgrade too, validate the user has enough resources.
        current_level = user_profile_metadata[building_name][location_hash]['level']
        puts "****************************************************************"
        puts game_metadata['buildings'][building_name]['levels'][(current_level+1).to_s]
        puts "****************************************************************"
        if( game_metadata['buildings'][building_name]['levels'][(current_level+1).to_s] )
          neededRock = game_metadata['buildings'][building_name]['levels'][(current_level+1).to_s]['rock'] - user_profile_metadata['rock'];
          neededLumber = game_metadata['buildings'][building_name]['levels'][(current_level+1).to_s]['lumber'] - user_profile_metadata['lumber'];
          if( neededRock > 0 && neededLumber > 0 )
            return {'valid' => false,
                    'error' => "Not enough resources, you need more #{neededRock} rock and #{neededLumber} lumber"}
          end
          if( neededRock > 0)
            return {'valid' => false,
                    'error' => "Not enough resources, you need more #{neededRock} rock"}
          end
          if( neededLumber > 0)
            return {'valid' => false,
                    'error' => "Not enough resources, you need more #{neededLumber} rock"}
          end
          # TODO : In here should come a part to check the dependency chain.
          # make sure that the user have met the conditions required for that upgrade.
        else
          return {'valid' => false,
                  'error' => "Max upgrade level reached"}
        end
        dependencies_valid = validate_dependencies(user_profile_metadata, game_metadata, building_name, (current_level+1).to_s)
        if(!dependencies_valid['valid'])
          return dependencies_valid
        end
        return {'valid' => true, 'error' => ''}
      end
      
    end
  end
end

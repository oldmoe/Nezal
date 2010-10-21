module BD
  module Townhall
    @@name = "townhall"
    def self.build(user_game_profile, coords)
      puts ">>>>>>>>>>>>>>>>>>>>>>> building " + @@name
      user_profile_metadata = JSON.parse(user_game_profile.metadata)
      game_metadata = JSON.parse(user_game_profile.game.metadata)
      
      validation = validateBuilding(user_profile_metadata, game_metadata, coords)
      return validation if validation['valid'] == false
      
      #####################################################################
      #####################################################################
      #####################################################################
      #####################################################################
      #####################################################################
      #####################################################################
      #####################################################################
      #####################################################################
      #####################################################################
      #####################################################################
      ####### START CODING HEREREREREREE ######
      #####################################################################
      #####################################################################
      #####################################################################
      
    end
    
    def self.validateBuilding(user_profile_metadata, game_metadata, coords)
      #validating workers
      if( user_profile_metadata['idle_workers'] == 0 )
        return { 'valid' => false,
                 'error' => "There is no idle workers to build the " + @@name}
      end

      #validating resources
      neededRock = game_metadata['buildings'][@@name]['levels']['1']['rock'] - user_profile_metadata['rock'];
      neededIron = game_metadata['buildings'][@@name]['levels']['1']['iron'] - user_profile_metadata['iron'];
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
      puts "BaseDefender.land_marks['grass'] : " + BaseDefender.land_marks['grass'].to_s
      puts "coords['x'] : " + coords['x'].to_s
      puts "coords['y'] : " + coords['y'].to_s
      
      if(user_profile_metadata['map'][coords['y']][coords['x']] != BaseDefender.land_marks['grass'])
        return {'valid' => false,
                'error' => @@name + " can be built on grass only!"}
      end
      
      return {'valid' => true, 'error' => ''}
    end
  
    def self.upgrade(user_game_profile)
      puts "upgrading townhall"
    end
    
  end
end
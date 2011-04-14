module BD
  class Neighbor
    class << self
      def neighbor_empire(profile, data)
        user_id = data['user_id']
        neighbor_user_profile = UserGameProfile.where('game_id'=> profile.game.id, 'user_id'=> user_id).first
        BaseDefender.load_game_profile( neighbor_user_profile )
        return {
          :user_data => { :rank => neighbor_user_profile.rank.name,
                          :exp => neighbor_user_profile.exp, 
                          :newbie => neighbor_user_profile.newbie,
                          :locale => neighbor_user_profile.locale, 
                          :metadata => protect_neighbor_data(neighbor_user_profile.metadata)
                        }
          }
      end
      
      def neighbor_profile(profile, data)
        user_id = data['user_id']
        neighbor_user_profile = UserGameProfile.where('game_id'=> profile.game.id, 'user_id'=> user_id).first
        BaseDefender.load_game_profile( neighbor_user_profile )
        return neighbor_user_profile
      end
      def friends( profile )
        UserGameProfile.where('game_id'=> profile.game.id).all.collect do |p|
          { :user_id => p.user_id, :service_id => p.user.service_id } unless p.user_id == profile.user.id
        end.compact
      end
      
      #protected
      
      #This will only leave in the metadata all building with their levels and either if it is in progress or not
      def protect_neighbor_data(metadata)
        protected_metadata = {}
        protected_metadata['map'] = metadata['map']
        building_modules = BaseDefender.building_modules
        building_modules.keys.each do |building_name|
          #Checking if the user have built this type of building or not yet
          if( metadata[building_name].present? )
            building_module = building_modules[building_name]
            building = metadata[building_name]
            protected_metadata[building_name] = {}
            #Looping on every resource building instance
            building.keys.each do |building_instance_coords|
              building_instance = building[building_instance_coords]
              protected_metadata[building_name][building_instance_coords] = {}
              protected_metadata[building_name][building_instance_coords]['level'] = building_instance['level']
              protected_metadata[building_name][building_instance_coords]['state'] = building_instance['state']
              protected_metadata[building_name][building_instance_coords]['coords'] = building_instance['coords']
            end
          end
        end
        protected_metadata
        
      end
      
    end
  end
end

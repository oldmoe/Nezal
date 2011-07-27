module BD
  class Neighbor
    class << self
      def neighbor_empire(profile, neighbor_id)
        neighbor_user_profile = neighbor_profile(profile, neighbor_id)
        protected_data = protect_neighbor_data(neighbor_user_profile)
        neighbor_user_profile.data = protected_data 
        neighbor_user_profile
      end
      
      def neighbor_profile(user_profile, neighbor_id)
        neighbor_key = UserGameProfile.generate_key(user_profile.service_type, Game::current.key, neighbor_id)
        neighbor_user_profile = UserGameProfile.get(neighbor_key)
      end

      #protected
      
      #This will only leave in the metadata all building with their levels and either if it is in progress or not
      def protect_neighbor_data(profile)
        protected_data = {}
        protected_data['map'] = profile.map
        building_modules = BaseDefender.building_modules
        building_modules.keys.each do |building_name|
          #Checking if the user have built this type of building or not yet
          unless( profile[building_name].nil? )
            building_module = building_modules[building_name]
            building = profile[building_name]
            protected_data[building_name] = {}
            #Looping on every resource building instance
            building.keys.each do |building_instance_coords|
              building_instance = building[building_instance_coords]
              protected_data[building_name][building_instance_coords] = {}
              protected_data[building_name][building_instance_coords]['level'] = building_instance['level']
              protected_data[building_name][building_instance_coords]['state'] = building_instance['state']
              protected_data[building_name][building_instance_coords]['coords'] = building_instance['coords']
              protected_data[building_name][building_instance_coords]['hp'] = building_instance['hp']
              building_module.neighbor_data.each { |key| protected_data[building_name][building_instance_coords][key] = building_instance[key] }
            end
          end
        end
        protected_data
      end
      
    end
  end
end

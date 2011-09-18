class UserMissions

  class << self  
    
    def all user_profile
      missions = {}
      Mission.all do |key, mission|
        missions[key] = { :name => mission['name'] }
      end
      missions
      Mission.all
    end 

    def data user_profile, mission_id
      data = {}
#      if user_profile.missions[mission_id]
        data = Mission.get(mission_id)
#      end
      data
    end

    def current user_profile
      Mission.get(user_profile.current_mission)
    end

  end

end

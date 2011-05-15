module BD

  class Wedge < Building

    @name = "wedge"
    @can_be_built_on = "grass"
    
    def initialize(name)
      @name = name
    end

    def neighbor_data
      self.class.neighbor_data
    end
 
    def build(user_game_profile, coords)
      self.class.build(user_game_profile, coords, @name)
    end

    def upgrade(user_game_profile, coords)
      self.class.upgrade(user_game_profile, coords, @name)
    end
    
    def move(user_game_profile, name, coords, oldCoords)
      self.class.move(user_game_profile, name, coords, oldCoords)
    end
  end

end

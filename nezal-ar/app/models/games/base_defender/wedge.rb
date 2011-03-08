module BD

  class Wedge < Building

    @name = "wedge"
    @can_be_built_on = "grass"
    
    def initialize(name)
      @name = name
    end
 
    def build(user_game_profile, coords)
      self.class.build(user_game_profile, coords, @name)
    end

    def upgrade(user_game_profile, coords)
      self.class.upgrade(user_game_profile, coords, @name)
    end

  end

end

module BD
  class WarFactory < Building
      @name = "war_factory"
      @can_be_built_on = "grass"
    class << self
      def build(user_game_profile, coords, name=nil)
          building_name = name || @name
          location_hash = BaseDefender.convert_location(coords)
          validation = super(user_game_profile, coords, name)
          user_game_profile.metadata[building_name][location_hash]['queue'] = {"size"=>0,"creep"=>nil,
          "last_creep_start"=>nil, "creep_production_time"=>nil}
          return validation
      end
    end
  end
end
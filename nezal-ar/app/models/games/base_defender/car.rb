module BD
  class Car < Creep
    def initialize(map, initial_x, initial_y, id, game_data)
      super(map, initial_x, initial_y, id, game_data, "car")
    end
  end  
end


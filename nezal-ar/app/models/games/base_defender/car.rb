module BD
  class Car < Creep
    def initialize(map,initial_x, initial_y,id,game_metadata)
      super(map,initial_x, initial_y,id,game_metadata,"car")
    end
  end  
end


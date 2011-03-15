module BD
  class Car < Creep
    def initialize(map,initial_x, initial_y)
      super(map,initial_x, initial_y)
      @map = map
      @map_direction = Map.N  
      @coords = {}
      @coords['x'] = initial_x.to_i
      @coords['y'] = initial_y.to_i
      @moving_path = []
      @done_attack = false
      @hp = 100
      @range = 4
      @power = 10
      @speed = 3
      @name = "car"
      @target_located = false
      @target = nil 
      @dead = false
      @done_attack = false
      @attacked = false
    end
    attr_accessor :target, :dead, :done_attack, :coords, :moving_path, :attacked
    def tick      
      unless @target
        @target = pick_target 
      end
      unless(@target)
        return
      end
      super
      if(@target && @moving_path.length == 0)
        @target.owner["hp"] -=@power
        @attacked = true
      end
      if (@target.owner["hp"] <= 1)
        @target.owner["hp"] = 1
        @target = nil
      end 
    end
    
    def pick_target
      min_index = -1
      min_distance = 9999999
      0.upto(@map.objects.length-1) do |i|
        next if ( @map.objects[i].owner["hp"] <=1 )
        building = @map.objects[i] 
        distance_to_building = Util.distance(@coords['x'],@coords['y'],building.owner['coords']['x'],building.owner['coords']['y'])
        if distance_to_building < min_distance
          min_distance = distance_to_building
          min_index = i
        end
     end
     if min_index == -1
       @done_attack = true
       return nil
     end
      @map.move_object(self, @map.objects[min_index].owner['coords']['x'] , @map.objects[min_index].owner['coords']['y'])
      @target_located = true
      return @map.objects[min_index]
    end
  end  
end

module BD
  class MovingObject
    def initialize(map,x,y)
      @coords = nil
      @moving = false 
      @rotating = false
      @target_angle =0
      @angle = 0
      @speed = 0.7
      @random_move = false
      @distance_to_next_tile = 0
      @no_of_states = 8
      @state = 0
      @tick_counter = 0
      @coords = {}
      @coords['x'] = x
      @coords['y'] = y
      @moving_path = []
      @map = map
    end
    attr_accessor :coords, :moving, :rotating, :target_angle, :angle, :speed, :random_move, :distance_to_next_tile, 
    :no_of_states, :state, :tick_counter, :map, :moving_path  
    def tick 
      @tick_counter= @tick_counter+1 
      if(@moving_path.length>0)
        if(@target_angle!=@angle)
          change_angle()
          return
        end
        values = @map.value(@moving_path[@moving_path.length-1]['x'],@moving_path[this.moving_path.length-1]['y'])
        if(!@moving)
          @moving = true
          @distance_to_next_tile = Util.distance(@coords['x'],@coords['y'],values[0],values[1])  
          @target_angle = @map.get_direction(@coords['x'],@coords['y'],values[0],values[1])
        end
        movements = Util.get_next_move(@coords['x'], @coords['y'], values[0], values[1], @speed)
        @state = (@state+1)%8 if(@tick_counter%3==0)
        @coords['x']+=movements[0]
        @coords['y']+=movements[1]
        map_values = @map.tile_value(@coords['x'], @coords['y'])
        if(@coords['x'] == values[0] && @coords['y'] == values[1])
          @moving_path.pop()
          if(@moving_path.length>0)
            values = @map.value(@moving_path[@moving_path.length-1]['x'], @moving_path[@moving_path.length-1]['y'])
            @target_angle = @map.get_direction(@coords['x'], @coords['y'], values[0], values[1])
          end
        end
        if(@moving_path.length == 0)
           @moving = false
           @state = 0
        end
      end
    end
  
    def change_angle 
      if(@angle > @target_angle)
        if((@target_angle+8) - @angle < @angle - @target_angle)
          @angle = (@angle+1) % 8 
        else
          @angle = (@angle+7) % 8
        end
      else
        if(@target_angle - @angle < (@angle+8) - @target_angle)
          @angle = (@angle+1) % 8 
        else
          @angle = (@angle+7) % 8
        end
      end     
    end
  
    def calculate_current_state values
      numirator = (@distance_to_next_tile - Util.distance(@coords['x'],@coords['y'],values[0],values[1]))*@no_of_states
      return (numirator/@distance_to_next_tile).round
    end
  end
end

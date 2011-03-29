module BD
  class Car < Creep
    def initialize(map,initial_x, initial_y,id)
      super(map,initial_x, initial_y)
      @map = map
      @id = id
      @map_direction = Map.N  
      @coords = {}
      @coords['x'] = initial_x.to_f
      @coords['y'] = initial_y.to_f
      @moving_path = []
      @done_attack = false
      @target_edge = nil
      @hp = 100.0
      @tick_counter =0 
      @range = 4.0
      @power = 3.0
      @speed = 3.0
      @name = "car"
      @target_located = false
      @target = nil 
      @dead = false
      @attacked = false
    end
    attr_accessor :target, :dead, :done_attack, :coords, :moving_path, :attacked, :target_edge, :hp, :tick_counter
    def tick
      @tick_counter = @tick_counter + 1
      if @hp <= 0 
       @done_attack = true
       return
     end
      unless @target
        @target = pick_target 
      end
      unless(@target)
        return
      end
      super
      if(@target && @moving_path.length == 0)
        @target.hp -=@power
        @attacked = true
      end
      if (@target.hp <= 1)
        @target.hp = 1
        @target = nil
      end 
    end
    
    def pick_target
      min_index = -1
      min_distance = 9999999
      0.upto(@map.objects.length-1) do |i|
        next if ( @map.objects[i].hp <=1 )
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
      edges = get_building_attack_points @map.objects[min_index]
      min_edges = []
      
      0.upto(1) do |j|
        min_distance = 999999
        min_edge = -1
        0.upto(edges.length-1) do |i|
          edge = edges[i]
          d = Util.distance(@coords['x'],@coords['y'],edge['x'],edge['y'])
          if(d< min_distance)
            min_distance = d
            min_edge = i
          end
        end
        min_edges.push(edges[min_edge])
        edges.delete(edges[min_edge])
      end
      @target_edge = min_edges[0]
      @map.move_object(self, @target_edge['x'] , @target_edge['y'])
      @target_located = true
      return @map.objects[min_index]
    end
    
    
    def get_building_attack_points obj
      edges = []
      origin = {
        'x'=> obj.owner['coords']['x'] - obj.img_width / 2,
        'y'=> obj.owner['coords']['y'] - obj.img_height / 2
      }
      left = Math.sin(Util.deg_to_rad(@map.tile_angle))* obj.xdim
      right = Math.sin(Util.deg_to_rad(@map.tile_angle))* obj.ydim
      edges.push({'x'=>origin['x']+obj.img_width/4, 'y'=>origin['y']+obj.zdim+left/2})
      edges.push({'x'=>origin['x']+obj.img_width*3/4, 'y'=>origin['y']+obj.zdim+right/2})
      edges.push({'x'=>origin['x']+obj.img_width*3/4, 'y'=>origin['y']+right*3/2+obj.zdim})
      edges.push({'x'=>origin['x']+obj.img_width/4, 'y'=>origin['y']+obj.zdim+left*3/2})
      return edges
    end
  
    
  end  
end


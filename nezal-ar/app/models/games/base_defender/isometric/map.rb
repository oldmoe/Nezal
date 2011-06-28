module BD
  class Map
      @@E=0
      @@NE=1
      @@N=2
      @@NW=3
      @@W=4
      @@SW=5
      @@S=6
      @@SE=7
      ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'].each do |attr|
  class_eval <<EOF
    def self.#{attr}
      @@#{attr}
    end
    
    def self.#{attr}=(new_value)
      @@#{attr} = new_value
    end
EOF
    end
    def initialize raw_map
      initialize_variables
      no_of_rows = raw_map.length
      no_of_columns = raw_map[0].length
      0.upto(no_of_rows-1) do |i|
        @grid[i]= []
        0.upto(no_of_columns-1) do |j|
          @grid[i][j] = Node.new(i,j)
           @grid[i][j].terrain_type = raw_map[i][j];
        end
      end
      init_directions()
      @tile_iso_length = Math.sqrt((@tile_width/2)**2+(@tile_height/2)**2)/2
      @tile_angle = get_tile_angle()
    end
    
    def initialize_variables
      @grid = []
      @tile_width=64.0
      @tile_height=31.0
      @view_width=760.0
      @view_height=550.0
      @map_width = 1000.0
      @map_height = 1000.0 
      @x=380.0,@y=275.0
      @speed=2.0
      @origin=[0.0,0.0]
      @row_even_directions = {}
      @row_odd_directions = {}
      @objects = []
      @zone_points = [{'x'=>1495,'y'=>551},{'x'=>765,'y'=>914},{'x'=>25,'y'=>550},{'x'=>771,'y'=>157}]
    end
    attr_accessor :grid, :tile_width, :tile_height, :view_width, :view_height, :map_width, :map_height, :x, :y, :speed,
      :origin, :row_even_directions, :row_odd_directions, :objects, :tile_angle
    def init_directions
     @row_even_directions[@@N]=[-2,0]
     @row_even_directions[@@S]=[2,0]
     @row_even_directions[@@E]=[0,1]
     @row_even_directions[@@W]=[0,-1]
     @row_even_directions[@@NE]= [-1,0]
     @row_even_directions[@@NW]=[-1,-1] 
     @row_even_directions[@@SE]=[1,0]
     @row_even_directions[@@SW]=[1,-1]
     @row_odd_directions[@@N]=[-2,0]
     @row_odd_directions[@@S]=[2,0]
     @row_odd_directions[@@E]=[0,1]
     @row_odd_directions[@@W]=[0,-1]
     @row_odd_directions[@@NE]=[-1,1]
     @row_odd_directions[@@NW]=[-1,0]
     @row_odd_directions[@@SE]=[1,1]
     @row_odd_directions[@@SW]=[1,0]
   end
    
   def get_tile_angle
    a = Math.sqrt((@tile_width/2)**2+(@tile_height/2)**2)/2
    theta = (180-Util.rad_to_deg(Math.acos((@tile_width*@tile_width/4-2*a*a)/(2*a*a))))/2
    theta
  end

  def self.get_general_direction x1,y1,x2,y2
    dir = 0
    slope = 0
    begin 
      slope = ((y1-y2).to_f/(x1-x2)).round
      if(slope == 0 && x1 > x2)
        dir = @@W
      elsif(slope == 0 && x1 < x2)
        dir = @@E
      elsif(slope == -1 && x1 < x2)
        dir = @@NE
      elsif(slope == -1 && x1 > x2)
        dir = @@SW
      elsif(slope == 1 && x1 > x2)
        dir = @@NW
      elsif(slope == 1 && x1 < x2)
        dir = @@SE
      elsif(slope < -1 && x1 < x2)
        dir = @@N
      elsif(slope < -1 && x1 > x2)
        dir = @@S
      elsif(slope > 1 && x1 > x2)
        dir = @@N
      elsif(slope > 1 && x1 < x2)
        dir = @@S
      end
    rescue ZeroDivisionError
      if(y1 > y2)
        dir = @@N;
      else
        dir = @@S;
      end
    rescue FloatDomainError
      if(y1 > y2)
        dir = @@N;
      else
        dir = @@S;
      end
    end
    return dir;
  end  

  def get_direction x1,y1,x2,y2
    tile1 = tile_value(x1,y1)
    tile2 = tile_value(x2,y2)
    i = tile1[0]; j = tile1[1]
    i2 = tile2[0]; j2 = tile2[1]
    row_even_directions = [[@@N,i-2,j],[@@S,i+2,j],[@@E,i,j+1],[@@W,i,j-1],[@@NE,i-1,j],[@@NW,i-1,j-1],[@@SE,i+1,j],[@@SW,i+1,j-1]]
    row_odd_directions = [[@@N,i-2,j],[@@S,i+2,j],[@@E,i,j+1],[@@W,i,j-1],[@@NE,i-1,j+1],[@@NW,i-1,j],[@@SE,i+1,j+1],[@@SW,i+1,j]]
    if i%2 == 0  
      0.upto(row_even_directions.length-1) do |k|
        return row_even_directions[k][0] if(i2==row_even_directions[k][1]&&j2==row_even_directions[k][2])
      end
    else
       0.upto(row_odd_directions.length-1) do |k|
        return row_odd_directions[k][0] if(i2==row_odd_directions[k][1]&&j2==row_odd_directions[k][2]) 
      end
    end
    return 0
  end
  
  def get_neighbor i,j,direction
     ret = nil
     if(i%2==0)
      ret = @row_even_directions[direction]
     else 
      ret = @row_odd_directions[direction]
     end
     return [ret[0]+i, ret[1]+j] if(@grid[ret[0]+i] && @grid[ret[0]+i][ret[1]+j]) 
  end
  
  def neighbors node
    i=node.x
    j=node.y
    ret_list = []
    0.upto(7) do |k|
        neighbor = get_neighbor(i,j,k)
        if(!neighbor.nil? && (@grid[neighbor[0]][neighbor[1]].value ==0 || @grid[neighbor[0]][neighbor[1]].target)  && @grid[neighbor[0]][neighbor[1]].terrain_type==0 ) 
          ret_list.push(@grid[neighbor[0]][neighbor[1]])
        end
    end
    ret_list
  end

  def tile_value x,y
    half_x = ((x*2/@tile_width).floor).to_f
    half_y = ((y*2/@tile_height).floor).to_f
    half_w = @tile_width/2
    half_h = @tile_height/2
    up = false
    if(half_x%2==half_y%2)
      if(x-half_x*half_w+y-half_y*half_h < (half_x+1)*half_w-x+(half_y+1)*half_h-y)
        up = true
      end
    else
      if((half_x+1)*half_w-x+y-half_y*half_h <x-half_x*half_w +(half_y+1)*half_h-y)
        up = true
      end
    end
    grid_x=0
    grid_y=0
    if(half_x%2==0&&half_y%2==0&&!up ||half_x%2!=0&&half_y%2==0&&!up || half_x%2!=0&&half_y%2!=0 &&up || half_x%2==0&&half_y%2!=0 &&up)
      grid_y = 2*(half_y/2).floor+1
      grid_x = (half_x/2).floor
    else
      grid_y = half_y + half_y%2
      grid_x = ((half_x+1)/2).floor
    end
    return [grid_y,grid_x]
  end

  def value i,j
    y = (((i-1)*@tile_height/2).round).to_f
    y = 0.0 if(y<0.0)
    x=-((i+1)%2)*@tile_width/2+j*@tile_width+@tile_width/2;
    return [x,y]
  end
  
  def add_object_to_grid obj
    no_of_rows = (obj.xdim/@tile_iso_length).ceil
    no_of_columns = (obj.ydim/@tile_iso_length).ceil
    top_x = obj.owner['coords']['x'] 
    top_y = obj.owner['coords']['y'] -@tile_height/2
    origin_tile = tile_value(top_x,top_y)
    map_tiles = []
    0.upto(no_of_rows) do |i|
      next if(origin_tile.nil?) 
      origin_tile = get_neighbor(origin_tile[0],origin_tile[1],@@SW)
      next if(origin_tile.nil?)
      looping_tile = []
      looping_tile[0] = origin_tile[0];
      looping_tile[1] = origin_tile[1];
      0.upto(no_of_columns) do |j|
        @grid[looping_tile[0]][looping_tile[1]].value = obj
        map_tiles.push(@grid[looping_tile[0]][looping_tile[1]])
        looping_tile = get_neighbor(looping_tile[0],looping_tile[1],@@SE)
      end
    end
    obj.map_tiles = map_tiles
  end

  def validate_location obj
    valid = true
    0.upto(@objects.length) do |i|
      if(obj.collides(@objects[i]))
        valid = false
        break
      end
    end
    inside_polygon = Util.is_inside(obj,@zone_points)
    return valid && inside_polygon
  end
  
  def add_element obj
      @objects.push(obj)
      add_object_to_grid(obj)
      return true
  end

  def lookup_location x,y
    map_coords = tile_value(x,y)
    return @grid[map_coords[0]][map_coords[1]].value.owner if(@grid[map_coords[0]][map_coords[1]].value!=0)
    return nil
  end
  
  def occupied x,y
    map_tiles = tile_value x,y
    return true if(@grid[map_tiles[0]][map_tiles[1]].value!=0)
    return false
  end
  
    
  def move_object object,x,y,options = {}
    ignore_place = false
    callback = nil
    if(options['callback']) 
      callback = options['callback']
    end
    if(options['ignore_place']) 
      ignore_place = options['callback']
    end
    astar = Astar.new
    src_tiles = tile_value(object.coords['x'], object.coords['y'])
    dest_tiles = tile_value(x,y)
    @grid[dest_tiles[0]][dest_tiles[1]].target= true
    if(@grid[dest_tiles[0]][dest_tiles[1]].value!=0 && !options['ignore_place']) 
      dest_tiles = get_nearest_empty_tile(dest_tiles)
    end
    path = astar.get_optimal_path(self,@grid[src_tiles[0]][src_tiles[1]],@grid[dest_tiles[0]][dest_tiles[1]])
    @grid[dest_tiles[0]][dest_tiles[1]].target = false
    0.upto(@grid.length-1) do |i|
      0.upto(@grid[0].length-1) do |j|
          @grid[i][j].g=@grid[i][j].h=@grid[i][j].f = 0
          @grid[i][j].visited=@grid[i][j].closed = false
          @grid[i][j].parent = nil
      end
    end
    if(!path.nil?)
      object.moving = false;
	    object.target_point = {'x'=>x,'y'=>y}
      object.moving_path = path;
      object.movement_finish_callback = callback if(!callback.nil?)
      return path
    end
  end


  def get_nearest_empty_tile tile
    open_list = []
    open_list.push(tile)
    found = false
    while(!found) do
      tile = open_list[0]
      0.upto(7) do |k|
        neighbor = get_neighbor(tile[0],tile[1],k)
        if(!neighbor.nil? && @grid[neighbor[0]][neighbor[1]].value ==0 &&
          @grid[neighbor[0]][neighbor[1]].terrain_type==0)
             return neighbor;
        elsif(!neighbor.nil?) 
          open_list.push(neighbor)
        end
      end
      open_list.shift      
    end 
  end
  
  
  end
end



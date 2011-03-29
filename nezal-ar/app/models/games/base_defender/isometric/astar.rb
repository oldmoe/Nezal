module BD
  class Node
    def initialize(x,y)      
      @x=x
      @y=y
      @terrain_type =0 
      @value =0
      @h=0 
      @g=0 
      @f=0 
      @target = false
      @closed =false 
      @visited = false 
      @node= nil 
      @parent = nil
    end
    attr_accessor :x, :y, :terrain_type, :value, :h, :g, :f, :closed, :visited, :node, :parent, :target
  end
  
  class Astar
    def initialize
    end
    def get_optimal_path(map, src_node, dst_node)
      open_list = []
      open_list.push(src_node)
      while(open_list.length > 0) do
         low_ind = 0;
         0.upto(open_list.length-1) do |i|
          low_ind = i if(open_list[i].f < open_list[low_ind].f)
         end
         current_node = open_list[low_ind];
         if(current_node.x == dst_node.x && current_node.y == dst_node.y)
          curr = current_node
          ret = []
          while(!curr.parent.nil?) do
            ret.push(curr);
            curr = curr.parent;
          end
          return ret;
         end
         open_list.delete_at(low_ind);
         current_node.closed = true;
         neighbors = map.neighbors(current_node);
         0.upto(neighbors.length-1) do |i|
           neighbor = neighbors[i];
           next if(neighbor.closed)
           g_score = current_node.g + get_distance(current_node,neighbor)
           g_score_is_best = false
           if(!neighbor.visited) 
            g_score_is_best = true;
            neighbor.h = get_distance(neighbor,dst_node)
            neighbor.visited = true;
            open_list.push(neighbor);
           elsif(g_score < neighbor.g)
            g_score_is_best = true;
           end
           if(g_score_is_best) 
            neighbor.parent = current_node;
            neighbor.g = g_score;
            neighbor.f = neighbor.g + neighbor.h;
           end
          end
        end
     end
     
     def get_distance(node1,node2)
      return Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2)
     end
  end
end

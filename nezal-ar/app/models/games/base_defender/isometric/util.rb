module BD
  class Util
    def self.deg_to_rad deg
      return deg * Math::PI / 180
    end
    
    def self.rad_to_deg rad
      return rad * 180 / Math::PI
    end
    
    def self.min a,b
      return (a<b)?a:b
    end
  #gets the distances to move according to the speed
  #@x1,@y1 params : coordinates of the object
  #@x2,@y2 params : coordinates of the target
  #@speed param : speed of movement
  def self.get_next_move(x1,y1,x2,y2,speed) 
    if(x1==x2&&y1==y2)
      return [0,0,0]
    end
    distance = Util.distance(x1,y1,x2,y2)
    speed = Util.min(speed,distance)
    tan = (y1 - y2)/(x1-x2);
    angle = Math.atan(tan);
    dy = ((speed * Math.sin(angle))).abs;
    dx = ((speed * Math.cos(angle))).abs;
    x_diff = x1-x2;
    y_diff = y1-y2;
    if(x_diff>0)
      dx*=-1 
    end
    if(y_diff>0)
      dy*=-1 
    end
    movements = [];
    movements[0] = dx;
    movements[1] = dy;
    movements[2] = angle
    return movements;
  end
  
  def self.line_intersection(v1,v2)
    if(Util.point_direction([v1[0],v1[1]],v2)* Util.point_direction([v1[2],v1[3]],v2) <= 0 &&
     Util.point_direction([v2[0],v2[1]],v1)* Util.point_direction([v2[2],v2[3]],v1) <= 0) 
      return true
    end
    return false
  end

  def self.point_direction(p,line)
   v1 = [line[0]-p[0],line[1]-p[1]]
   v2 = [line[2]-p[0],line[3]-p[1]]
   return v1[0]*v2[1] - v2[0]*v1[1]
  end
  
   def self.collision(u1,u2)
    a = [u1.owner['coords']['x'],u1.owner['coords']['y']-u1.img_height/2+u1.zdim]
    b = [u1.owner['coords']['x']-u1.img_width/2,u1.owner['coords']['y']+u1.zdim/2]
    c = [u1.owner['coords']['x'],u1.owner['coords']['y']+u1.img_height/2]
    d = [u1.owner['coords']['x']+u1.img_width/2,u1.owner['coords']['y']+u1.zdim/2]
    
    ab =  [a[0],a[1],b[0],b[1]]
    bc =  [b[0],b[1],c[0],c[1]]
    cd =  [c[0],c[1],d[0],d[1]]
    da =  [d[0],d[1],a[0],a[1]]
    
    x = [u2.owner['coords']['x'],u2.owner['coords']['y']-u2.img_height/2+u2.zdim]
    y = [u2.owner['coords']['x']-u2.img_width/2,u2.owner['coords']['y']+u2.zdim/2]
    z = [u2.owner['coords']['x'],u2.owner['coords']['y']+u2.img_height/2]
    w = [u2.owner['coords']['x']+u2.img_width/2,u2.owner['coords']['y']+u2.zdim/2]
    
    xy =  [x[0],x[1],y[0],y[1]]
    yz =  [y[0],y[1],z[0],z[1]]
    zw =  [z[0],z[1],w[0],w[1]]
    wx =  [w[0],w[1],x[0],x[1]]
    
    v1 = [ab,bc,cd,da]
    v2 = [xy,yz,zw,wx]
    
    0.upto(3) do |i|
      0.upto(3) do |j|
        if(Util.line_intersection(v1[i],v2[j]))
          return true
        end
      end
    end
    
    return false
  end

   def self.distance(x1,y1,x2,y2)
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
   end
   
  end  
end


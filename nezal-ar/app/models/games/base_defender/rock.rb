module BD

  class Rock   

    POSITION = {
      0 => { x: 46, y: 44 }, 
      1 => { x: 41, y: 20 },
      2 => { x: 12, y: 25 },
      3 => { x: 6,  y: 18 }, 
      4 => { x: 0,  y: 44 }, 
      5 => { x: 3,  y: 42 }, 
      6 => { x: 19, y: 50 }, 
      7 => { x: 44, y: 42 }
    }

    IMG_WIDTH = 15
    IMG_HEIGHT = 15

    def initialize(owner, creep)
      @owner = owner
      @extraXStep = 0
      @extraYStep = 0
      @coords = { x: 0, y: 0}
      img_width = BaseDefender.adjusted_game_metadata['buildings']['wedge']['levels'][@owner.owner.owner['level'].to_s]['display']['imgWidth']
      img_height = BaseDefender.adjusted_game_metadata['buildings']['wedge']['levels'][@owner.owner.owner['level'].to_s]['display']['imgHeight']
      @coords[:x] = @owner.coords['x'] + POSITION[@owner.angle][:x] + @extraXStep - img_width/2 + IMG_WIDTH/2;
      @coords[:y] = @owner.coords['y'] + POSITION[@owner.angle][:y] + @extraYStep - img_height/2 + IMG_HEIGHT/2;
      @attacker = nil
    end  

    def tick
      if(!@attacker)
        @attacker = @owner.attacker
        @extraXStep = 0
        @extraYStep = 0
      end
      if @attacker
        target_x = @attacker.coords['x']
        target_y = @attacker.coords['y'] + 108/8;
        move = Util.get_next_move(@coords[:x], @coords[:y], target_x, target_y, 20)
        @extraXStep = move[0]
        @extraYStep = move[1]
        if( @extraXStep.abs > (target_x - @coords[:x]).abs)
          @extraXStep = target_x - @coords[:x]
        end
        if( @extraYStep.abs > (target_y - @coords[:y]).abs)
          @extraYStep = target_y - @coords[:y]
        end
        @coords[:x] = @coords[:x] + @extraXStep
        @coords[:y] = @coords[:y] + @extraYStep
        if(@coords[:x] == target_x && @coords[:y] == target_y )
          @owner.fire()
          destroy()
        end
      else
        destroy()
      end
    end

    def destroy
      @owner.rocks.delete(self)
    end

  end  
  
end

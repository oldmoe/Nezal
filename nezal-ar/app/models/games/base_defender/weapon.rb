module BD 

  class Weapon

    @name = "weapons"
    @building  = BD::Wedge.name

    def self.buy(user_game_profile, wedge_coords, weapon)
      game_data = Game::current.data
      location_hash = BaseDefender.convert_location(wedge_coords)
      
      validation = validate(user_game_profile, wedge_coords)
      return validation if validation['valid'] == false

      # Get selected weapon data from metadata.
      weapon_data = game_data[@name][weapon]
      # Add the weapon to the selected building.
      user_game_profile.data[@building][location_hash][@name] = weapon
      # Remove the cost from of the weapon from the user coins/resources 
      user_game_profile.user.coins -= weapon_data['cost']['coins'] if weapon_data['cost']['coins']
      ['rock', 'lumber'].each do | key | 
        if weapon_data['cost'][key]
          user_game_profile.data[key] -= weapon_data['cost'][key]
        end
      end
      return validation
    end

    def self.sell(user_game_profile, wedge_coords, weapon)
    end

    def self.validate(user_profile, coords, weapon)
      game_data = Game::current.data
      # Make sure there is a building at the described location.
      if (!user_profile.data[@building][coords]) || 
          (user_profile.data[@building][coords]['level'] < 1)
        return {'valid' => false,
                'error' => "There is no wedge at the selected location, OR wedge still under construction." }
      end
      # Make sure there is enough coins/resources to cover the cost of action.
      validation = {'valid' => true, 'error' => "Not enough resources, you need more " }
      neededCoins = game_data[@name][weapon]['cost']['coins']
      if( neededCoins  && (neededCoins - user_profile.user.coins) > 0)
        validation['valid'] = false
        validation['error'] += (neededCoins - user_profile.user.coins) + " coins .. "
      end
      neededRock = game_data[@name][weapon]['cost']['rock']
      if( neededRock && (neededRock - user_profile.rock) > 0)
        validation['valid'] = false
        validation['error'] += (neededRock - user_profile.rock) + " rocks .. "
      end      
      neededLumber = game_data[@name][weapon]['cost']['lumber']
      if( neededLumber &&  (neededLumber - user_profile.lumber) > 0)
        validation['valid'] = false
        validation['error'] += (neededLumber - user_profile.lumber) + " lumber .. "
      end
      return validation
    end

    attr_accessor :owner, :coords, :angle, :attacker, :rocks, :rock_num, :specs
    # Create a new weapon instance for the wedges to detect the attack
    # Should take the wedge map building as owner to simulate the attack
    def initialize(owner, creeps)
      @creeps = creeps 
      @owner = owner
      @attacker = nil
      @step = 0
      @tick = 0
      @angle = 0
      @rocks = []
      @weapon = Game::current.buildings['wedge']['levels'][@owner.owner['level'].to_s]['weapon']
      @specs = Game::current.buildings['wedge']['levels'][@owner.owner['level'].to_s]['specs']
      @coords = @owner.owner['coords']
      @animated = false
      @move_steps = 2
    end

    def tick      
      if(@owner.owner['state'] == BD::Building.states['NORMAL'])
        check_attack()
        if @attacker
          @angle = Map.get_general_direction(@coords['x'], @coords['y'], @attacker.coords['x'], @attacker.coords['y'])
        end 
#        puts "Weapon Tick :: #{self.__id__} "
      end 
    end

    def display_tick
      if(@owner.owner['state'] == BD::Building.states['NORMAL'])
        if @attacker == nil
          @step = 0
          @animated = false
        elsif @attacker && @animated == false
          @animated = true
        end
        if @attacker && @animated
          @step += 1
          if @step == @move_steps
            rock = BD::Rock.new(self, @attacker)
            @rocks << rock
          end
          if @step == 9
            @step = 0
            @animated = false
            fire
          end
        end
#        puts "Weapon Render :: #{self.__id__} :: #{@step} :: #{@animated}"
      end
      @rocks.each do |rock| 
                    if(!rock.done) 
                      rock.tick 
                    end
                  end
    end

    def check_attack()
      if(@owner.hp <= 1)
        @attacker = nil 
        return
      end
      if (@attacker && @attacker.hp > 0)
        return
      end
      attack = nil
      minHp = 50000
      minDistance = @specs['range']
      @creeps.each do |creep|
        if creep.hp > 0 
          dist = Util.distance(@coords['x'], @coords['y'], creep.coords['x'], creep.coords['y']);
          if(dist < minDistance)
            if(creep.hp < minHp)
              minHp = creep.hp;
              attack = creep;
            end
          end
        end
      end
      @attacker = attack;
    end

    def fire 
      @attacker = nil
    end

  end

end

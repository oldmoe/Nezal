module BD

  class Garage < Building

    @name = "garage"
    @can_be_built_on = "grass"
    
    def initialize coords,ugp
      @coords = coords
      @name = "garage"
      @can_be_built_on = "grass"
      @ugp = ugp
      @location_hash = BaseDefender.convert_location(coords)
      @level = @ugp.data[@name][@location_hash]['level']
    end

    def set_state state
      @ugp.data[@name][@location_hash]['state'] = state
      if(state==BD::Building.states['NORMAL'])
          game_data = Game::current.data
          change_garage_capacity
          check_stopped_war_factories @ugp, game_data
      end
    end

    def change_garage_capacity
      game_data = Game::current.data
      @ugp.total_garage_units=0 if(@ugp.total_garage_units.nil?)
      @ugp.garage_units_used=0 if(@ugp.garage_units_used.nil?)
      garage_levels = game_data['buildings']['garage']['levels']
      puts "level = #{garage_levels[(@level-1).to_s]['storage_units']}"
      @ugp.total_garage_units+= (garage_levels[@level.to_s]['storage_units']-garage_levels[(@level-1).to_s]['storage_units'])
    end

    def check_stopped_war_factories ugp, game_metadata
      war_factories = ugp.war_factory
      return if(war_factories.nil?)
      war_factories.each_pair do |k,building|
      next if(building['state'] != BD::Building.states['NORMAL'])
        if(building['queue']['stopped'])
          queue = building['queue']
          creep = queue['creep']
          creep_storage = game_data['creeps'][creep]['garage_units']
          storage_remaining = ugp.total_garage_units - ugp.garage_units_used
          if(storage_remaining > creep_storage)
            building['queue']['size']-=1
            building['queue']['stopped'] = false
            ugp.garage_units_used+= creep_storage
            ugp.creeps= {} if(ugp.creeps.nil?)
            ugp.creeps[queue['creep']] = 0 if(ugp.creeps[queue['creep']].nil?)
            ugp.creeps[queue['creep']]+= 1
            if(queue['size']!=0)
              queue['last_creep_start'] = Time.now.utc.to_i
              queue['remaining_time'] = queue['creep_production_time']
            end
         end
        end
      end
    end

    class << self
      
    end

  end
end

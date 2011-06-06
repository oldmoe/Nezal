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
      @level = @ugp.metadata[@name][@location_hash]['level']
    end
    def set_state state
      @ugp.metadata[@name][@location_hash]['state'] = state
      if(state==BD::Building.states['NORMAL'])
          game_metadata = BaseDefender.adjusted_game_metadata
          change_garage_capacity
          check_stopped_war_factories @ugp, game_metadata
      end
    end
    def change_garage_capacity
          game_metadata = BaseDefender.adjusted_game_metadata
          @ugp.metadata['total_garage_units']=0 if(@ugp.metadata['total_garage_units'].nil?)
          @ugp.metadata['garage_units_used']=0 if(@ugp.metadata['garage_units_used'].nil?)
          garage_levels = game_metadata['buildings']['garage']['levels']
          puts "level = #{garage_levels[(@level-1).to_s]['storage_units']}"
          @ugp.metadata['total_garage_units']+= (garage_levels[@level.to_s]['storage_units']-garage_levels[(@level-1).to_s]['storage_units'])
    end
    def check_stopped_war_factories ugp, game_metadata
        ugp_metadata = ugp.metadata
        war_factories = ugp_metadata['war_factory']
        return if(war_factories.nil?)
        war_factories.each_pair do |k,building|
         next if(building['state'] != BD::Building.states['NORMAL'])
         if(building['queue']['stopped'])
            queue = building['queue']
            creep = queue['creep']
            creep_storage = game_metadata['creeps'][creep]['garage_units']
            storage_remaining = ugp_metadata['total_garage_units'] - ugp_metadata['garage_units_used']
            if(storage_remaining > creep_storage)
              building['queue']['size']-=1
              building['queue']['stopped'] = false
              ugp_metadata['garage_units_used']+= creep_storage
              ugp_metadata['creeps']= {} if(ugp_metadata['creeps'].nil?)
              ugp_metadata['creeps'][queue['creep']] = 0 if(ugp_metadata['creeps'][queue['creep']].nil?)
              ugp_metadata['creeps'][queue['creep']]+= 1
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

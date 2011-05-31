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
    end
    def set_state state
      @ugp.metadata[@name][@location_hash]['state'] = state
      if(state==BD::Building.states['NORMAL'])
          game_metadata = BaseDefender.adjusted_game_metadata
          check_stopped_war_factories @ugp, game_metadata
      end
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
      def build(user_game_profile, coords, name=nil)
          validation = super(user_game_profile, coords, name)
          game_metadata = BaseDefender.adjusted_game_metadata
          user_game_profile.metadata['total_garage_units']=0 if(!user_game_profile.metadata['total_garage_units'].nil?)
          user_game_profile.metadata['garage_units_used']=0 if(!user_game_profile.metadata['garage_units_used'].nil?)
          user_game_profile.metadata['total_garage_units']+= game_metadata['buildings']['garage']['levels']['1']['storage_units']
          return validation
      end
      def upgrade(user_game_profile, coords, name=nil)
          validation = super(user_game_profile, coords, name)
          building_name = name || @name
          location_hash = BaseDefender.convert_location(coords)
          game_metadata = user_game_profile.game.metadata
          garage_levels = game_metadata['buildings'][building_name]['levels']
          if(validation['valid'])
             level = user_game_profile[building_name][location_hash]['level']
             user_game_profile.metadata['total_garage_units']+= (garage_levels[level.to_s]['storage_units']-garage_levels[(level-1).to_s]['storage_units'])
         end
      end
    end
  end
end

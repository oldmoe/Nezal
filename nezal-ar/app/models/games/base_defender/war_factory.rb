module BD
  class WarFactory < Building
      @name = "war_factory"
      @can_be_built_on = "grass"
      def initialize coords, ugp
        @coords = coords
        @name = "war_factory"
        @can_be_built_on = "grass"
        @ugp = ugp
        @location_hash = BaseDefender.convert_location(coords)
        @level = @ugp.metadata[@name][@location_hash]['level']
        @queue = @ugp.metadata[@name][@location_hash]['queue']
      end
      
     def process_creeps_generation
        now = Time.now.utc.to_i
        game_metadata = BaseDefender.adjusted_game_metadata
        ugp_metadata = @ugp.metadata
        if(@queue['size']!=0)
            creeps_generated = (now - @queue['last_creep_start'])/@queue['creep_production_time']
            creep_storage_units = game_metadata['creeps'][@queue['creep']]['garage_units']
            ugp_metadata['total_garage_units'] = 0 if (ugp_metadata['total_garage_units'].nil?)
            ugp_metadata['garage_units_used'] = 0 if (ugp_metadata['garage_units_used'].nil?)
            garage_remaining = ugp_metadata['total_garage_units'] - ugp_metadata['garage_units_used'] 
            
            if(@queue['size'] < creeps_generated)
              creeps_generated = @queue['size'] 
            end
            if(creeps_generated*creep_storage_units <= garage_remaining)
                #increase the number of creeps in the garage by queue['size']
              @queue['size'] -= creeps_generated
            else
                #increase the number of creeps in the garage by garage remaining capacity
                @queue['stopped'] = true
                creeps_generated = (garage_remaining/creep_storage_units).floor
                @queue['size']-= creeps_generated
            end
            ugp_metadata['garage_units_used']+= creeps_generated * creep_storage_units
            ugp_metadata['creeps']= {} if(ugp_metadata['creeps'].nil?)
            ugp_metadata['creeps'][@queue['creep']] = 0 if(ugp_metadata['creeps'][@queue['creep']].nil?)
            ugp_metadata['creeps'][@queue['creep']]+= creeps_generated
            if(@queue['size']!=0)
              @queue['last_creep_start'] = @queue['last_creep_start'] + creeps_generated * @queue['creep_production_time']
              time_passed = now - @queue['last_creep_start'] 
              @queue['remaining_time'] = @queue['creep_production_time'] - time_passed
              @queue['remaining_time'] = 0 if @queue['creep_production_time'] - time_passed < 0
          end
        end
      end
      
     def generate_creep creep
        game_metadata = BaseDefender.adjusted_game_metadata
        wf_max_size = game_metadata['buildings']['war_factory']['levels'][@level.to_s]['max_queue_size']
        if(@queue['size'] >= wf_max_size)
           return {'valid' => false, 'error' => 'queue is max size'}
        else
          needs =  game_metadata['creeps'][creep]['needs']
          if(!(@ugp.metadata['lumber']>=needs['lumber'] && @ugp.metadata['rock']>=needs['rock']))
            return {'valid' => false, 'error' => 'not enough resources'}
          end
          if(@queue['size']!=0 && @queue['creep']!=creep)
             return {'valid' => false, 'error' => 'Another creep in production.'}
          end
          @queue['size']+=1 
          if(@queue['size']==1)
            @queue['last_creep_start']= Time.now.utc.to_i         
            @queue['creep'] = creep
            @queue['creep_production_time'] = needs['time']
            @queue['remaining_time'] = needs['time']
            @ugp.metadata['lumber']-=needs['lumber']
            @ugp.metadata['rock']-=needs['rock']
          end
      end
      return {'valid' => true, 'error' => ''}
     end
      
     def cancel_creep_generation
       game_metadata = BaseDefender.adjusted_game_metadata
      if(@queue['size']==0)
        #return false validation with nothing in queue
        return {'valid' => false, 'error' => 'nothing to be cancelled'}
      else
        @queue['size']-=1
        needs =  game_metadata['creeps'][@queue['creep']]['needs']
        @ugp.metadata['lumber']+=needs['lumber']
        @ugp.metadata['rock']+=needs['rock']
        if(@queue['size']==0)
          @queue['last_creep_start']= nil
          @queue['creep'] = nil
          @queue['creep_production_time'] = nil
        end
      end
      return {'valid' => true, 'error' => ''}
    end
      
    class << self
      def build(user_game_profile, coords, name=nil)
          building_name = name || @name
          location_hash = BaseDefender.convert_location(coords)
          validation = super(user_game_profile, coords, name)
          user_game_profile.metadata[building_name][location_hash]['queue'] = {"size"=>0,"creep"=>nil,
          "last_creep_start"=>nil, "creep_production_time"=>nil,"remaining_time"=>nil, 'stopped'=> false}
          return validation
      end
    end
  end
end
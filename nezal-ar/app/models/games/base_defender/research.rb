module BD

  class Research
    
    def self.init( user_game_profile )
      user_game_profile.metadata['researches'] ||= {}
      researches = BaseDefender.adjusted_game_metadata['researches'].keys
      researches.each do |r|
        user_game_profile.metadata['researches'][r] ||= {"done" => false}
      end
      #user_game_profile.save
    end
    
    def self.cancel( user_game_profile , research_name )
      research_metadata = BaseDefender.adjusted_game_metadata['researches'][research_name]
      user_profile_metadata = user_game_profile.metadata
      
      #Check if this research didn't started yet or already done
      already_done = user_profile_metadata['researches'][research_name]['done'] == true
      didnt_started = user_profile_metadata['researches'][research_name]['started'] == false
      if already_done
        return {'valid' => false, 'error' => research_name.capitalize + ' is already researched!'}
      end
      
      if didnt_started
        return {'valid' => false, 'error' => research_name.capitalize + ' is not active yet!'}
      end
      
      lumber_to_refund = research_metadata['needs']['lumber'] * 75 / 100
      rock_to_refund = research_metadata['needs']['lumber'] * 75 / 100
      total_storage = BD::ResourceBuilding.calculate_total_storage(user_profile_metadata, BaseDefender.adjusted_game_metadata)
      
      free_lumber_space = total_storage - user_profile_metadata['lumber']
      lumber_to_refund = lumber_to_refund > free_lumber_space ? free_lumber_space : lumber_to_refund
      user_profile_metadata['lumber'] += lumber_to_refund
      
      free_rock_space = total_storage - user_profile_metadata['rock']
      rock_to_refund = rock_to_refund > free_rock_space ? free_rock_space : rock_to_refund
      user_profile_metadata['rock'] += rock_to_refund
      
      user_profile_metadata['researches'][research_name]['started'] = false
      
      return {'valid' => true, 'error' => ''}
    end
    
    def self.start( user_game_profile , research_name )
      research_metadata = BaseDefender.adjusted_game_metadata['researches'][research_name]
      user_profile_metadata = user_game_profile.metadata
      
      #Check if there is already a research going on
      researches = user_profile_metadata['researches'].keys
      researches.each do |research_index|
        research = user_profile_metadata['researches'][research_index]
        if research['started'] && !research['done']
           return {'valid' => false, 'error' => 'Another research ( ' + research_index.capitalize + ' ) is already started!'}
        end
      end
      
      #Check if this research is already working or already done
      already_done = user_profile_metadata['researches'][research_name]['done'] == true
      already_started = user_profile_metadata['researches'][research_name]['started'] == true
      if already_done
        return {'valid' => false, 'error' => research_name.capitalize + ' is already researched!'}
      end
      
      if already_started
        return {'valid' => false, 'error' => research_name.capitalize + ' is already started!'}
      end
      
      
      #Check if the required resources are available
      lumber_ready = user_profile_metadata['lumber'] - research_metadata['needs']['lumber']
      rock_ready = user_profile_metadata['rock'] - research_metadata['needs']['rock']
      
      if lumber_ready < 0 && rock_ready < 0
        return {'valid' => false, 
                'error' => "To start researching " + research_name.capitalize + ', you need more ' + (-lumber_ready).to_s +
                           " lumber and " + (-rock_ready).to_s + " rock!"}
      end
      
      if lumber_ready < 0
        return {'valid' => false, 
                'error' => "To start researching " + research_name.capitalize + ', you need more ' + (-lumber_ready) +" lumber!"}
      end
      
      if rock_ready < 0
        return {'valid' => false, 
                'error' => "To start researching " + research_name.capitalize + ', you need more ' + (-rock_ready) +" rock!"}
      end
      
      #Commit
      user_profile_metadata['researches'][research_name]['started'] = true
      user_profile_metadata['researches'][research_name]['started_at'] = Time.now.utc.to_i
      user_profile_metadata['lumber'] -= research_metadata['needs']['lumber']
      user_profile_metadata['rock'] -= research_metadata['needs']['rock']
      user_game_profile.needs_saving
      return {'valid' => true, 'error' => ''}
    end
    
    def self.operate( user_game_profile )
      user_profile_metadata = user_game_profile.metadata
      user_profile_metadata['researches'].keys.each do |research_name|
        research = user_profile_metadata['researches'][research_name]
        research_metadata = BaseDefender.adjusted_game_metadata['researches'][research_name]
        if research['started']
          time_passed = Time.now.utc.to_i - research['started_at']
          time_remaining = research_metadata['needs']['time'] - time_passed
          if( time_remaining <= 0 )
            research['done'] = true
          else
            research['time_remaining'] = time_remaining
          end
        end
      end
      
    end
    
  end
  
end

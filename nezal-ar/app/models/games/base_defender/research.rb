module BD

  class Research
    
    def self.init( user_game_profile )
      user_game_profile.researches ||= {}
      Game::current.researches.keys.each do |r|
        user_game_profile.researches[r] ||= {"done" => false}
      end
    end
    
    def self.total_hp_bonus( user_profile )
      bonus_hp_percent = 0;
      researches = user_profile.researches.keys
      researches.each do |research_index|
        research = user_profile.researches[research_index]
        if research['done'] && research['buildings'] && research['hp']
           bonus_hp_percent += research['benefits']['buildings']['hp'].to_i
        end
      end
      bonus_hp_percent
    end
    
    def self.cancel( user_game_profile , research_name )
      research_data = Game::current.researches[research_name]
      #Check if this research didn't started yet or already done
      already_done = user_game_profile.researches[research_name]['done'] == true
      didnt_started = user_game_profile.researches[research_name]['started'] == false
      if already_done
        return {'valid' => false, 'error' => research_name.capitalize + ' is already researched!'}
      end
      
      if didnt_started
        return {'valid' => false, 'error' => research_name.capitalize + ' is not active yet!'}
      end
      
      lumber_to_refund = research_data['needs']['lumber'] * 75 / 100
      rock_to_refund = research_data['needs']['lumber'] * 75 / 100
      total_storage = BD::ResourceBuilding.calculate_total_storage(user_profile)
      
      free_lumber_space = total_storage - user_game_profile.lumber
      lumber_to_refund = lumber_to_refund > free_lumber_space ? free_lumber_space : lumber_to_refund
      user_game_profile['lumber'] += lumber_to_refund
      
      free_rock_space = total_storage - user_game_profile.rock
      rock_to_refund = rock_to_refund > free_rock_space ? free_rock_space : rock_to_refund
      user_game_profile.rock += rock_to_refund
      
      user_game_profile.researches[research_name]['started'] = false
      
      return {'valid' => true, 'error' => ''}
    end
    
    def self.start( user_game_profile , research_name )
      research_data = Game::current.researches[research_name]
      
      #Check if there is already a research going on
      researches = user_game_profile.researches.keys
      researches.each do |research_index|
        research = user_game_profile.researches[research_index]
        if research['started'] && !research['done']
           return {'valid' => false, 'error' => 'Another research ( ' + research_index.capitalize + ' ) is already started!'}
        end
      end
      
      #Check if this research is already working or already done
      already_done = user_game_profile.researches[research_name]['done'] == true
      already_started = user_game_profile.researches[research_name]['started'] == true
      if already_done
        return {'valid' => false, 'error' => research_name.capitalize + ' is already researched!'}
      end
      
      if already_started
        return {'valid' => false, 'error' => research_name.capitalize + ' is already started!'}
      end
      
      #Check if the required resources are available
      lumber_ready = user_game_profile.lumber - research_data['needs']['lumber']
      rock_ready = user_game_profile.lumber - research_data['needs']['rock']
      
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
      user_game_profile.researches[research_name]['started'] = true
      user_game_profile.researches[research_name]['started_at'] = Time.now.utc.to_i
      user_game_profile.lumber -= research_data['needs']['lumber']
      user_game_profile.rock -= research_data['needs']['rock']
      return {'valid' => true, 'error' => ''}
    end
    
    def self.operate( user_game_profile )
      user_game_profile.researches.keys.each do |research_name|
        research = user_game_profile.researches[research_name]
        research_data = Game::current.researches[research_name]
        if research['started']
          time_passed = Time.now.utc.to_i - research['started_at']
          time_remaining = research_data['needs']['time'] - time_passed
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

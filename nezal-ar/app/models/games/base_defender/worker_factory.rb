module BD
  module WorkerFactory
    def self.buy_worker(user_game_profile)
      
      current_number_of_workers = user_game_profile.metadata['workers']
      total_workers_allowed = user_game_profile.game.metadata['workers']['initial_allowed'];
      house_metadata = user_game_profile.game.metadata['buildings']['house']
      user_houses = user_game_profile.metadata['house']
      if(!user_houses.nil?)
        user_houses.values.each do |house|
         total_workers_allowed += house_metadata['levels'][house['level'].to_s]['workers']
       end
      end
      if(total_workers_allowed <= current_number_of_workers)
        return {'valid' => false,
                'error' => "You need to build more houses"}
      end
      
      factor  = user_game_profile.game.metadata['workers']['factor']
      required_coins = user_game_profile.game.metadata['workers']['initial_coins'] * factor
      
      validation = validate_buy_worker(user_game_profile.user, required_coins)
      return validation if validation['valid'] == false
      
      user_game_profile.metadata['workers'] += 1
      user_game_profile.metadata['idle_workers'] += 1
      user_game_profile.save
      
      user_game_profile.user.coins -= required_coins
      
      puts ">>>>>>>>>>>> 1!!!!" + user_game_profile.user.coins.to_s
      
      user_game_profile.user.save
      
      return validation
    end
    
    def self.validate_buy_worker(user, required_coins)
      if(user.coins < required_coins)
        return {'valid' => false,
                'error' => "Not enough coins, you need more #{required_coins - user.coins} coins"}
      else
        return {'valid' => true,
                'error' => ""}
      end
    end
  end
end

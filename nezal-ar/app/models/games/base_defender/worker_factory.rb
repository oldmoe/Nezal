module BD

  module WorkerFactory

    def self.buy_worker(user_game_profile)
      game = Game::current
      current_number_of_workers = user_game_profile.workers
      total_workers_allowed = game.workers['initial_allowed'];
      house_data = game.buildings['house']
      user_houses = user_game_profile.house
      if(!user_houses.nil?)
        user_houses.values.each do |house|
         if(house['state']==BD::Building.states['NORMAL'])
          total_workers_allowed += house_data['levels'][house['level'].to_s]['workers']
         end
       end
      end
      if(total_workers_allowed <= current_number_of_workers)
        return {'valid' => false,
                'error' => "You need to build more houses"}
      end
      factor  = game.workers['factor']
      required_coins = game.workers['initial_coins'] * factor
      validation = validate_buy_worker(user_game_profile.user, required_coins)
      return validation if validation['valid'] == false
      user_game_profile.workers += 1
      user_game_profile.idle_workers += 1
      user = user_game_profile.user
      user.coins -= required_coins
      user.save
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

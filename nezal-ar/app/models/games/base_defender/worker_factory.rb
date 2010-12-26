module BD
  module WorkerFactory
    def self.buy_worker(user_game_profile)
      
      current_number_of_workers = user_game_profile.metadata['workers']
      required_coins = user_game_profile.game.metadata['workers'][(current_number_of_workers+1).to_s]['coins']
      
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

module BD
  module WorkerFactory
    def self.buy_worker(user_game_profile)
      user_profile_metadata = JSON.parse(user_game_profile.metadata)
      game_metadata = JSON.parse(user_game_profile.game.metadata)
      
      current_number_of_workers = user_profile_metadata['workers']
      required_coins = game_metadata['workers'][(current_number_of_workers+1).to_s]['coins']
      
      validation = validate_buy_worker(user_game_profile.user, required_coins)
      return validation if validation['valid'] == false
      
      user_profile_metadata['workers'] += 1
      user_profile_metadata['idle_workers'] += 1
      user_game_profile.metadata = BaseDefender.encode(user_profile_metadata)
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
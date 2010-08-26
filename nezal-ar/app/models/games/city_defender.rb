require 'yajl'

class CityDefender < Metadata

  def self.edit(game, data)
    game.metadata = data 
    game.save
  end  

  def self.load_game_profile(game, user)
    game_profile = UserGameProfile.find_by_game_id_and_user_id(game.id, user.id)
    game_profile.metadata || "{}"
  end
  
  def self.init_game_profile(game_profile)
    game_profile.metadata= self.encode({'towers'=>[],'weapons'=>[],'upgrades'=>[],'added'=>{'towers'=>[],'weapons'=>[],'upgrades'=> []} })
  end
  
end

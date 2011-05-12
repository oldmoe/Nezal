class Metadata

  def self.encode(data)
     Yajl.dump(data)
  end
  
  def self.decode(data)
    Yajl.load(data)
  end

  ######################################################################
  # Default game metadata actions : init, edit, load, delete
  ######################################################################
  def self.init_game(game)
    game.metadata = {}
    game.save
  end
  
  def self.edit_game(game, data)
    game.metadata= self.decode(data) 
    game.save
  end  
    
  def self.load_game(game)
    game.metadata || {}
  end

  def self.delete_game(game)
  end

  ######################################################################
  # Default game profile metadata actions : init, edit, load, delete
  ######################################################################
  def self.init_game_profile(game_profile)
    game_profile.metadata =  {}
    game_profile.save
  end
  
  def self.edit_game_profile(game_profile, data)
    game_profile.metadata = self.decode(data)
    game_profile.save
  end
  
  def self.load_game_profile(game_profile)
    game_profile.metadata || {}
  end
  
  def self.delete_game_profile(game_profile)
  end

  ######################################################################
  # Default campaign metadata actions : init, edit, load, delete
  ######################################################################
  def self.init_campaign(camp)
    camp.metadata = {}
    camp.save
  end
  
  def self.edit_campaign(camp, data)
    camp.metadata = self.decode(data)
    camp.save
  end
  
  def self.load_campaign(camp)
    camp.metadata    
  end

  def self.delete_campaign(camp)    
  end
  
  ######################################################################
  # Default user campaign metadata actions : init, edit, load, delete
  ######################################################################
  def self.init_user_campaign(user_campaign)
    user_campaign.metadata= {}
    user_campaign.save
  end
  
  def self.edit_user_campaign(user_campaign, data_encoded)
    user_campaign.metadata= self.decode(data)
    user_campaign.save
  end
  
  def self.load_user_campaign(user_campaign)
    user_campaign.metadata || {}
  end

  def self.delete_user_campaign(user_campaign)
  end

  ######################################################################
  # Default quest metadata actions : init, edit, load, delete
  ######################################################################
  def self.init_quest(quest)
    quest.metadata= {}
    quest.save
  end

  def self.edit_quest(quest, data)
    quest.metadata= self.decode(data)
    quest.save
  end
  
  def self.load_quest(quest)
    quest.metadata    
  end

  def self.delete_quest(quest)
  end
  
  ######################################################################
  # Default language/locale actions : init, edit, load, delete
  ######################################################################
  def self.init_language_data    
  end

  def self.edit_language_data    
  end

  def self.load_language_data    
  end

  def self.delete_language_data    
  end

  ######################################################################
  # General Purpose requests : bookmark app, like app, invitation rewards
  ######################################################################
  def self.process_request(profile, data)
  end
  
  def self.bookmark(profile)
  end
  
  def self.like(profile)
  end
  
  def self.reward_invitation(fb_id)
  end
  
end

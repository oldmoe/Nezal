module BD

  class Research
    
    def self.init( user_game_profile )
      user_game_profile.metadata['researches'] ||= BaseDefender.adjusted_game_metadata['researches']
      user_game_profile.save
    end
    
  end
  
end

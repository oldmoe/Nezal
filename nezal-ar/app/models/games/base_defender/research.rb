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
    
    def self.start( user_game_profile , researchName )
      research_metadata = BaseDefender.adjusted_game_metadata['researches'][researchName]
      user_profile_metadata = user_profile_metadata.metadata
      
      #Check if this research is already working or already done
        
      #Check if the required resources are available
      return {'valid' => true, 'error' => ''}
    end
    
    def self.operate( user_game_profile , researchName )
      
    end
    
  end
  
end

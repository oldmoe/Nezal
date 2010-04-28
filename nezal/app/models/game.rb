class Game

  include DataStore::Storable
  extend DataStore::KeyGenerators::SequenceKey
  
  many_to_one   :ranks
  many_to_one   :game_campaigns, :class_name => :Campaign
  one_to_one    :current_campaign, :class_name => :Campaign, :identified_by => :current_campaign_id

  # The attributes should have the name and the description 
  attr_accessor :attributes
    
  def initialize(hash)
    @attributes = hash
    if @attributes[:current_campaign_id] == nil
      campaign = Campaign.new({ :name => "Weekly Challenge", :config_path => "" })
      game_campaigns << campaign
      self.current_campaign= campaign
    end
  end
  
end

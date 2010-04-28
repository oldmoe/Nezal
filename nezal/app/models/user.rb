class User
  include DataStore::Storable

  # Those attributes should include coins, basic info
  attr_accessor :attributes
  
  many_to_one  :game_ranks, :class_name => :UserRank
  many_to_one  :user_campaigns, :class_name => :UserCampaign
  
  def initialize(hash)
    @attributes = hash
  end
  
end

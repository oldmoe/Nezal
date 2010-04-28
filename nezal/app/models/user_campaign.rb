class UserCampaign

  include DataStore::Storable
  extend DataStore::KeyGenerators::SequenceKey
    
  one_to_one  :campaign, :class_name => :Campaign
  one_to_many :game, :class_name => :Game
  one_to_many :user, :class_name => :FBUser
  
  # This should have the score of the campaign
  attr_accessor :attributes
  
  def self.generate(object)
    object.game[:id] + object.campaign[:id] + super(self)
  end
  
  def initialize(hash)
    @attributes = hash
  end
  
  

end

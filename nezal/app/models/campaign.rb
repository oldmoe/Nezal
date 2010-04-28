class Campaign

  include DataStore::Storable
  extend DataStore::KeyGenerators::SequenceKey
  
  one_to_many :game, :as => :game_campaigns
  
  attr_accessor :attributes
  
  def initialize(hash)
    @attributes = hash
  end

end

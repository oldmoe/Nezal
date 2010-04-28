class UserRank

  include DataStore::Storable
  
  def self.generate(object)
    object.game[:id] + object.user[:id]
  end
  
  one_to_many :game, :class_name => :Game
  one_to_many :user, :class_name => :User, :as => :game_ranks
  
  attr_accessor :attributes
  
  def initialize(hash)
    @attributes = hash
  end

end

class Rank

  include DataStore::Storable
  extend DataStore::KeyGenerators::SequenceKey
  
  one_to_many :game, :class_name => :Game
  
  def self.generate(object)
    object.game[:id] + "-" +super(object)
  end
  
  # This attributes list should have lower_ep(exeperience points), upper_ep
  attr_accessor :attributes
    
  def initialize(hash)
    @attributes = hash
  end
  
end

class TestWriter 
  include DataStore::Storable 
  extend DataStore::KeyGenerators::SequenceKey

#  has_many :test_blogs  
  attr_accessor :attributes
  
  def initialize(hash)
    @attributes = hash
  end
    
end


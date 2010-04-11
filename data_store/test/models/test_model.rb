class TestModel
  include DataStore::Storable
  extend DataStore::KeyGenerators::SequenceKey

  attr_accessor :attributes
  
  def initialize(hash)
    @attributes = hash
  end
  
end

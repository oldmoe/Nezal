class TestModel
  include DataStore::SequenceKey
  include DataStore::Storable

  attr_accessor :attributes
  has_one :test_model
  
  def initialize(hash)
    @attributes = hash
  end
  
end


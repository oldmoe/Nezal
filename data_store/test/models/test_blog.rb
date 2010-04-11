class TestBlog
  include DataStore::Storable
  extend DataStore::KeyGenerators::SequenceKey

#  has_one :test_writer
  attr_accessor :attributes
  
  def initialize(hash)
    @attributes = hash
  end
  
end


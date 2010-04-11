class FBUser
  include DataStore::Storable
  #  has_one :test_writer
  attr_accessor :attributes
  
  def initialize(hash)
    @attributes = hash
  end
  
end

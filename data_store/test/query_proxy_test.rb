require 'lib/data_store'
require 'test/test_model'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize

MiniTest::Unit.autorun

class QueryProxyTest < MiniTest::Unit::TestCase

  def initialize(name)
    super name
  end
  
  def setup   
    pre_name = "pre_"+__name__
    self.send(pre_name) if self.respond_to? pre_name  rescue raise Exception.new("Error in pre method of test: #{__name__}")
  end

  def teardown
    post_name = "post_"+__name__
    self.send(post_name) if self.respond_to? post_name rescue raise Exception.new("Error in post method of test: #{__name__}")
  end  
  
  # Test creation, retrieval of a simple non relational creation
  # Each test_method defines its own pre, post methods to create 
  #   nessecarry records / delete them after completion
  def create_simple_record
    @attributes = {x: 1, y: 2}
    @record = TestModel.create(@attributes)    
  end
  
  def delete_simple_record
    TestModel.delete(@record[:id]) 
  end

  # Test creation, retrieval of a simple non relational creation
  # Each test_method defines its own pre, post methods to create 
  #   nessecarry records / delete them after completion
  def pre_test_each
    @records = []
    4.times { @records << create_simple_record }
  end
  
  def post_test_each
    4.times { 
      @record
      delete_simple_record 
    }
  end
  
  # This should create a simple records and call the each method on it 
  def test_each
  
  end

  def test_where
    query = DataStore::QueryProxy.new(TestModel.name).where(id: "6")
#    query.each {|obj| puts obj}
  end

  def test_where_with_true_block
    query = DataStore::QueryProxy.new(TestModel.name).where{ true }
    query.each {|obj| puts obj}
  end

  def test_where_with_false_block
    query = DataStore::QueryProxy.new(TestModel.name).where{ false }
    query.each {|obj| puts obj}
  end

  def test_where_with_both_blocks
    query = DataStore::QueryProxy.new(TestModel.name).where{ true }.where{ false }
    query.each {|obj| puts obj}
  end


end

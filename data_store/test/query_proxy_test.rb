Dir.chdir("lib") { require 'data_store' }
require 'test/models/test_model'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize
TestModel.db_handle.truncate(nil)

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
  def create_simple_record(hash)
    @attributes = hash
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
    4.times { |i| @records << create_simple_record({x: i, y: i*2}) }
  end
  
  def post_test_each
    @records.each do |rec| 
      @record = rec 
      delete_simple_record
    end
  end
  
  # Test simple where
  def test_where
    pre_test_each
    puts "************** begin : test_where"
    rec = @records[2]
    query = DataStore::QueryProxy.new(TestModel.name).where(id: rec[:id])
    query.each do |obj|
     p obj
     assert_equal rec[:id], obj[:id]
    end
    puts "************** end : test_where"
    post_test_each
  end

  # Test Range where
  def test_where_range
    pre_test_each
    puts "************** begin : test_where_range"
    query = DataStore::QueryProxy.new(TestModel.name).where(id: @records[0][:id]..@records[2][:id])
    query.each { |obj| p obj}
    puts "************** end : test_where_range"
    post_test_each
  end

  # Test cascaded where
  def test_where_cascaded
    pre_test_each
    puts "************** begin : test_where_cascaded"
    query = DataStore::QueryProxy.new(TestModel.name).where(id: @records[0][:id]..@records[2][:id]).where(x: 1..2)
    query.each { |obj| p obj}
    puts "************** end : test_where_cascaded"
    post_test_each
  end
  
  def test_where_with_true_block
    pre_test_each
    puts "************** begin : test_where_true"
    query = DataStore::QueryProxy.new(TestModel.name).where{ true }
    query.each {|obj| p obj}
    puts "************** end : test_where_true"
    post_test_each
  end

  def test_where_with_false_block
    pre_test_each
    puts "************** begin : test_where_false"
    query = DataStore::QueryProxy.new(TestModel.name).where{ false }
    query.each {|obj| puts obj}
    puts "************** end : test_where_false"
    post_test_each
  end

  def test_where_with_both_blocks
    pre_test_each
    puts "************** begin : test_where_with_both_blocks"
    query = DataStore::QueryProxy.new(TestModel.name).where{ true }.where{ false }
    query.each {|obj| puts obj}
    puts "************** end : test_where_with_both_blocks"
    post_test_each
  end
  
    # Test creation, retrieval of a simple non relational creation
  # Each test_method defines its own pre, post methods to create 
  #   nessecarry records / delete them after completion
  def pre_test_order
    @records = []
    4.times do |i| 
      @records << create_simple_record({x: -i, y: i*2}) 
      @records << create_simple_record({x: -i, y: i*2}) 
    end
  end
  
  def post_test_order
    @records.each do |rec| 
      @record = rec 
      delete_simple_record
    end
  end
  
  def test_order
    puts "************** begin : test_order"
    query = DataStore::QueryProxy.new(TestModel.name).order({:x => :ascending})
    query.each {|obj| p obj}
    puts "************** end : test_order"
  end
  
  def test_order_cascaded
    pre_test_order
    puts "************** begin : test_order_cascaded"
    query = DataStore::QueryProxy.new(TestModel.name).order({:x => :descending}).order({:id => :ascending})
    query.each {|obj| p obj}
    puts "************** end : test_order_cascaded"
    post_test_order
  end

  def test_limit
    pre_test_each
    puts "************** begin : test_limit"
    query = DataStore::QueryProxy.new(TestModel.name).limit(2)
    query.each {|obj| puts obj}
    puts "************** end : test_limit"
    post_test_each
  end
  
  def test_limit_with_offset
    pre_test_each
    puts "************** begin : test_limit_with_offset"
    query = DataStore::QueryProxy.new(TestModel.name).limit(2, 2)
    query.each {|obj| p obj}
    puts "************** end : test_limit_with_offset"
    post_test_each
  end
  
  def test_limit_with_where
    pre_test_each
    puts "************** begin : test_limit_with_where"
    query = DataStore::QueryProxy.new(TestModel.name).where(id: @records[1][:id]..@records[3][:id]).limit(2)
    query.each {|obj| p obj}
    puts "************** end : test_limit_with_where"
    post_test_each
  end

  def test_limit_with_where_after
    pre_test_each
    puts "************** begin : test_limit_with_where_after"
    query = DataStore::QueryProxy.new(TestModel.name).limit(3).where(id: @records[1][:id]..@records[3][:id])
    query.each {|obj| p obj}
    puts "&&&&&&&&&&&&&&"
    TestModel.each {|obj| p obj}
    puts "&&&&&&&&&&&&&&"
    p TestModel.first
    puts "************** end : test_limit_with_where_after"
    post_test_each
  end


end

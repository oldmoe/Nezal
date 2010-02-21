require 'lib/data_store'
require 'test/test_model'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize

MiniTest::Unit.autorun

class DataStoreTest < MiniTest::Unit::TestCase

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
  
  def post_test_create_simple_record
    delete_simple_record
  end
  
  def test_create_simple_record
    create_simple_record
    assert_instance_of TestModel, @record
    assert_instance_of String, @record[:id]
    assert_equal @record.attributes, @attributes
  end
  
  def pre_test_get_simple_rocord
    create_simple_record 
  end
  
  def post_test_get_simple_rocord
    delete_simple_record
  end
  
  def test_get_simple_rocord
    @result = TestModel.get(@record[:id])
    assert_equal @result[:id], @record[:id]
    assert_equal @result.attributes, @attributes
  end
  
  def pre_test_delete_simple_record
    create_simple_record
  end
  
  def test_delete_simple_record
    TestModel.delete(@record[:id])
    assert_nil TestModel.get(@record[:id])
  end

  # Test creation, retrieval of a record with a storable attribute
  # Delete the record post creation
  def create_record_with_storable_attrs
    @rel_attributes = {x: 1, y: 2}
    @relation = TestModel.new(@rel_attributes)
    @attributes = {x: 1, y: 2, relation: @relation}
    @record = TestModel.create(@attributes)    
  end
  
  def delete_record_with_storable_attrs
    TestModel.delete(@relation[:id]) 
    TestModel.delete(@record[:id]) 
  end
  
  def post_test_create_record_with_storable_attrs
    delete_record_with_storable_attrs
  end
  
  def test_create_record_with_storable_attrs
    create_record_with_storable_attrs
    assert_instance_of TestModel, @record[:relation]
    assert_instance_of String, @record[:relation][:id]
    assert_equal @record[:relation].attributes, @relation.attributes
  end
  
  def pre_test_get_record_with_storable_attrs
    create_record_with_storable_attrs
  end
  
  def post_test_get_record_with_storable_attrs
    delete_record_with_storable_attrs
  end
  
  def test_get_record_with_storable_attrs
    @result = TestModel.get(@record[:id])
    assert_equal @result[:id], @record[:id]
    assert_equal @record[:relation].attributes, @rel_attributes
  end
  
  # Test creation of a record with a StorableList attribute
  # Delete the record post creation
  def create_record_with_storable_list_attrs
    @storable_attrs = { x: 1, y: 2 }
    @list = DataStore::StorableList.new(TestModel.name)
    3.times { @list << TestModel.new(@storable_attrs.dup) }
    @attributes = {x: 1, y: 2, list: @list}
    @record = TestModel.create(@attributes)    
  end
  
  def delete_record_with_storable_list_attrs
    @record[:list].each { |rec| TestModel.delete(rec[:id]) }
    TestModel.delete(@record[:id]) 
  end
  
  def post_test_create_record_with_storable_list_attrs
    delete_record_with_storable_list_attrs
  end
  
  def test_create_record_with_storable_list_attrs
    create_record_with_storable_list_attrs
    assert_instance_of TestModel, @record[:list][0]
    assert_instance_of String, @record[:list][0][:id]
    assert_equal @record[:list][0].attributes, @list[0].attributes
  end
  
  def pre_test_get_record_with_storable_list_attrs
    create_record_with_storable_list_attrs
  end
  
  def post_test_get_record_with_storable_list_attrs
    delete_record_with_storable_list_attrs
  end
  
  def test_get_record_with_storable_list_attrs
    @result = TestModel.get(@record[:id])
    assert_equal @result[:id], @record[:id]
    @storable_attrs.each_key { |key| assert_equal @result[:list][0][key], @storable_attrs[key] }
    assert_equal @result[:list].length, @list.length
  end  
  
  # Test Object methods save, destroy, saved?, dirty?
  def save_record_with_storable_list_attrs
    @storable_attrs = { x: 1, y: 2 }
    @list = DataStore::StorableList.new(TestModel.name)
    3.times { @list << TestModel.new(@storable_attrs.dup) }
    @attributes = {x: 1, y: 2, list: @list}
    @record = TestModel.new(@attributes)    
    @record.save
  end
  
  def post_test_save_record_with_storable_list_attrs
    delete_record_with_storable_list_attrs
  end
  
  def test_save_record_with_storable_list_attrs
    save_record_with_storable_list_attrs
    @result = TestModel.get(@record[:id])
    assert_instance_of TestModel, @result[:list][0]
    assert_instance_of String, @result[:list][0][:id]
    assert_equal @result[:list][0].attributes, @list[0].attributes
  end

  def pre_test_destroy_record_with_storable_list_attrs
    save_record_with_storable_list_attrs
  end

  def test_destroy_record_with_storable_list_attrs
    @record.destroy
    assert_nil TestModel.get(@record[:id])
  end
  
  def post_test_saved? 
    TestModel.delete(@record[:id])
    TestModel.delete(@record2[:id])
  end
  
  def test_saved?
    @attributes = {x: 1, y: 2}
    @record = TestModel.new(@attributes)
    assert_equal @record.saved?, false
    @record.save
    assert_equal @record.saved?, true
    @record2 = TestModel.create(@attributes)
    assert_equal @record2.saved?, true
    @record2[:x]= 2
    assert_equal @record2.saved?, false
  end

  def post_test_dirty? 
    TestModel.delete(@record[:id])
    TestModel.delete(@record2[:id])
  end

  def test_dirty?
    @attributes = {x: 1, y: 2}
    @record = TestModel.new(@attributes)
    assert_equal @record.dirty?, true
    @record.save
    assert_equal @record.dirty?, false
    @record2 = TestModel.create(@attributes)
    assert_equal @record2.dirty?, false
    @record2[:x]= 2
    assert_equal @record2.dirty?, true
  end

  
end


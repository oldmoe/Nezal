require 'lib/data_store'
require 'test/test_model'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize

MiniTest::Unit.autorun

class TestBlog
  has_one :owner, :class_name => :TestModel, :as => :blog
end

class TestModel
  has_one :blog, :class_name => :TestBlog
end

class DataStoreTest < MiniTest::Unit::TestCase
  
  ################################################
  # The following are methods used in initialization or creation of relations
  ################################################
  def test_to_associated_field_name
    assert_equal TestBlog.has_one_associated_field_name(:test_writer), :test_blogs
    assert_equal TestBlog.has_one_associated_field_name(:owner), :blog
  end

  ################################################
  # Test Accessor methods defined properly
  ################################################
  def test_accessors_for_has_one_attr
    assert_equal TestBlog.public_method_defined?(:test_writer), true
    assert_equal TestBlog.public_method_defined?("test_writer="), true
    blog = TestBlog.new({})
    writer = TestWriter.new({})
    blog.test_writer= writer
    assert_equal blog.test_writer, writer
    assert_equal writer.test_blogs.include?(blog), true
  end
  
  #################################################
  # What I would like to do now is test if I created a record with a has_one attr 
  # will it be saved and afterwards accessed properly
  #################################################
  # Test creation, retrieval of a record with a has_one attribute
  # Delete the record post creation
  def save_record_with_has_one_attrs
    @owner_attrs = {x: 1, y: 2}
    @owner = TestModel.new(@owner_attrs)
    @blog_attrs = {x: 1, y: 2}
    @blog = TestBlog.new(@blog_attrs)    
    @blog.owner= @owner
    @blog.save
  end
  
  def delete_record_with_has_one_attrs
    TestModel.delete(@owner[:id]) 
    TestBlog.delete(@blog[:id]) 
  end
    
  # Save a record with has_one attr and retrieve it afterwards
  def test_save_record_with_has_one_attrs
    save_record_with_has_one_attrs
    # Here we should retrieve both records and actually find them
    blog = TestBlog.get(@blog[:id])
    owner = TestModel.get(@owner[:id])
    # Make sure that the record attributes for both records
    # are both retrieved successfully
    assert_equal @blog.attributes, blog.attributes
    assert_equal @owner.attributes, owner.attributes
    # Make sure that the has_one attr was retrieved successfully
    assert_instance_of TestModel, blog.owner
    assert_equal blog.owner.attributes, @owner.attributes
    # Make sure also that the associated field in the has_one record was set correctly
    assert_instance_of TestBlog, owner.blog
    assert_equal owner.blog[:id], @blog[:id]
    # Post finish: Delete the created records
    delete_record_with_has_one_attrs
  end
  
end

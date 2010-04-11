require 'lib/data_store'
require 'test/test_model'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize

MiniTest::Unit.autorun

class DataStoreTest < MiniTest::Unit::TestCase
  
  ################################################
  # Test basic funtionality methods 
  # The following are methods used in initialization or creation of relations
  ################################################
  def test_to_associated_field_name
    assert_equal :test_writer, TestWriter.has_many_associated_field_name(:test_blogs)
  end
  
  def test_accessors_for_has_many_attr
    assert_equal true, TestWriter.public_method_defined?(:test_blogs)
    assert_equal true, TestWriter.public_method_defined?("test_blogs=")
    blog = TestBlog.new({})
    writer = TestWriter.new({})
    writer.test_blogs << blog
    assert_equal true, writer.test_blogs.include?(blog)
    assert_equal writer, blog.test_writer
  end

  #################################################
  # What I would like to do now is test if I created a record with a has_one attr  
  # will it be saved and afterwards accessed properly
  #################################################
  # Test creation, retrieval of a record with a has_one attribute
  # Delete the record post creation
  def save_record_with_has_many_attrs
    @writer_attrs = {x: 1, y: 2}
    @writer = TestWriter.new(@writer_attrs)
    @blog_attrs = {x: 1, y: 2}
    @blog = TestBlog.new(@blog_attrs)
    @blog2 = TestBlog.new({x: 1, y: 2})        
    @writer.test_blogs << @blog
    @writer.test_blogs << @blog2
    @writer.save
  end
  
  def delete_record_with_has_many_attrs
    TestBlog.delete(@blog[:id]) 
    TestBlog.delete(@blog2[:id])
    TestWriter.delete(@writer[:id])  
  end
  
  def test_save_record_with_has_many_attrs
    save_record_with_has_many_attrs
    # Here we should retrieve both records and actually find them
    writer = TestWriter.get(@writer[:id])
    blog = TestBlog.get(@blog[:id])
    blog2 = TestBlog.get(@blog2[:id])
    assert_equal @writer.attributes, writer.attributes
    assert_equal @blog.attributes, blog.attributes
    assert_equal @blog2.attributes, blog2.attributes
    # Make sure that the record attributes for both records
    # are both retrieved successfully
    assert_equal @writer[:id], blog.test_writer[:id]
    assert_equal @writer[:id], blog2.test_writer[:id]
    writer.test_blogs.each {|b| puts b.inspect }
    # Post test: delete the created records
#    delete_record_with_has_many_attrs
  end

=begin  
  
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
=end

end

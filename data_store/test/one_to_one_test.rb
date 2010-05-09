Dir.chdir("lib") { require 'data_store' }
require 'require_all'
require_all 'test/models/'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize

MiniTest::Unit.autorun

class TestBlog
  one_to_one :owner, :class_name => :TestWriter, :identified_by => :writer_id
end

class TestWriter 
  one_to_one :test_blog, :class_name => :TestBlog, :as => :owner, :foreign_key => :writer_id
end

class OneToOneTest < MiniTest::Unit::TestCase
  
  ################################################
  # The following are methods used in initialization or creation of relations
  ################################################
  def test_to_associated_field_name
    assert_equal TestBlog._one_to_one_associated_field(:owner), :test_blog
    assert_equal TestWriter._one_to_one_associated_field(:test_blog), :owner
  end
  
  def test_one_to_one_to_identifier
    assert_equal TestBlog._one_to_one_to_identifier(:owner), :writer_id
    assert_equal TestWriter._one_to_one_to_identifier(:test_blog), :test_blog_id
  end
  
  def test_one_to_one_to_foreign_key
    assert_equal :test_blog_id, TestBlog._one_to_one_to_foreign_key(:owner)
    assert_equal :writer_id, TestWriter._one_to_one_to_foreign_key(:test_blog) 
  end

  ################################################
  # Test Accessor methods defined properly
  ################################################
  def test_accessors_for_one_to_one_attr
    assert_equal TestBlog.public_method_defined?(:owner), true
    assert_equal TestBlog.public_method_defined?("owner="), true
    blog = TestBlog.new({})
    owner = TestWriter.new({})
    blog.owner= owner
    assert_equal owner, blog.owner 
    assert_equal blog, owner.test_blog
  end
  
  #################################################
  # What I would like to do now is test if I created a record with a has_one attr 
  # will it be saved and afterwards accessed properly
  #################################################
  # Test creation, retrieval of a record with a has_one attribute
  # Delete the record post creation
  def set_up_new_records
    @owner_attrs = {x: 1, y: 2}
    @owner = TestWriter.new(@owner_attrs)
    @blog_attrs = {x: 1, y: 2}
    @blog = TestBlog.new(@blog_attrs)    
  end
  
  def delete_test_records
    TestModel.delete(@owner[:id]) 
    TestBlog.delete(@blog[:id]) 
  end
    
  # Save case 1:
  #   Relation is defined with :one_to_one attributes in both classes
  #   Both records are newly created records
  #   Expected Behaviour : 
  #     Saving one object cascade the saving on the relation attribute and saves it too
  def test_save_case_1
    set_up_new_records
    @blog.owner= @owner
    @blog.save
    # Here we should retrieve both records and actually find them
    blog = TestBlog.get(@blog[:id])
    owner = TestWriter.get(@owner[:id])
    # Make sure that the record attributes for both records
    # are both retrieved successfully
    assert_equal @blog.attributes, blog.attributes
    assert_equal @owner.attributes, owner.attributes
    # Make sure that the one_to_one attr was retrieved successfully
    assert_instance_of TestWriter, blog.owner
    assert_equal blog.owner.attributes, @owner.attributes
    # Make sure also that the associated field in the one_to_one record was set correctly
    assert_instance_of TestBlog, owner.test_blog
    assert_equal owner.test_blog[:id], @blog[:id]
    # Make sure that the id of the attribute is successfuly set in the attributes hashog
    assert_equal blog.attributes[:writer_id], @owner.attributes[:id]
    assert_equal owner.attributes[:test_blog_id], @blog.attributes[:id]
    # Post finish: Delete the created records
    delete_test_records
  end
 
  # Save case 2:
  #   Relation is defined with :one_to_one attributes in both classes
  #   Writer object already saved. Blog object newly created
  #   Expected Behaviour : 
  #     Writer object is adjusted properly once relation is set
  def test_save_case_2
    set_up_new_records
    @owner.save
    owner = TestWriter.get(@owner[:id])
    # Make sure that the relational attribute along with key are both nils
    assert_nil owner.test_blog
    assert_nil owner.attributes[:test_blog_id]
    # Set the blog.owner to owner & check that relation is set correctly
    @blog.owner= owner
    assert_equal owner, @blog.owner
    assert_equal @blog, owner.test_blog   
    assert_equal @blog.attributes[:id], owner.attributes[:test_blog_id]
    assert_equal owner.attributes[:id], @blog.attributes[:writer_id]
    # Save the blog and make sure that everything is correct after saving
    # Here we should retrieve both records and actually find them
    @blog.save
    saved_blog = TestBlog.get(@blog[:id])
    saved_owner = TestWriter.get(@owner[:id])
    # make sure that one_to_one attrs are set correctly 
    assert_equal saved_owner.attributes[:id], saved_blog.attributes[:writer_id]
    assert_equal saved_blog.attributes[:id], saved_owner.attributes[:test_blog_id]
    assert_equal saved_blog.attributes[:id], saved_owner.test_blog.attributes[:id]
    assert_equal saved_owner.attributes[:id], saved_blog.owner.attributes[:id]
    delete_test_records
  end
 
  # Save case 3:
  #   Relation is defined with :one_to_one attributes in both classes
  #   Blog object already saved with an owner
  #   Create a new writer object and set the blog owner to it
  #   Expected Behaviour : 
  #     Old owner object is adjusted properly once relation saved
  #     New owner object adjusted correctly 
  #     Blog object is adjusted correctly
  def test_save_case_3
    set_up_new_records
    @owner2_attrs = {x: 1, y: 2}
    @owner2 = TestWriter.new(@owner2_attrs)
    @blog.owner= @owner
    @blog.save
    @owner2.save
    # Set the blog.owner to owner2 & check that relation is set correctly
    blog = TestBlog.get(@blog[:id])
    blog.owner= @owner2
    assert_equal @owner2, blog.owner
    assert_equal blog, @owner2.test_blog   
    assert_equal blog.attributes[:id], @owner2.attributes[:test_blog_id]
    assert_equal @owner2.attributes[:id], blog.attributes[:writer_id]
    # Here we should retrieve both records and actually find them
    # Save the blog and make sure that everything is correct after saving
    blog.save
    saved_blog = TestBlog.get(blog[:id])
    saved_owner = TestWriter.get(@owner2[:id])
    old_owner = TestWriter.get(@owner[:id])
    # make sure that one_to_one attrs are set correctly 
    assert_equal saved_owner.attributes[:id], saved_blog.attributes[:writer_id]
    assert_equal saved_blog.attributes[:id], saved_owner.attributes[:test_blog_id]
    assert_equal saved_blog.attributes[:id], saved_owner.test_blog.attributes[:id]
    assert_equal saved_owner.attributes[:id], saved_blog.owner.attributes[:id]
    # make sure that the old owner got updated correctly
    assert_nil old_owner.attributes[:test_blog_id]
    assert_nil old_owner.test_blog
  end
 
end


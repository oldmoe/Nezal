require 'lib/data_store'
require 'require_all'
require_all 'test/models/'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize

MiniTest::Unit.autorun

class TestBlogPost 
  one_to_many :author, :class_name => :TestWriter, :identified_by => :writer_id
end

class TestWriter 
  many_to_one :test_blog_posts, :class_name => :TestBlogPost, :as => :author, :foreign_key => :writer_id
end

class OneToManypTest < MiniTest::Unit::TestCase
  
  ################################################
  # The following are methods used in initialization or creation of relations
  ################################################
  def test_one_to_many_associated_field_name
    assert_equal TestBlogPost._one_to_many_associated_field(:author), :test_blog_posts
  end
  
  def test_one_to_many_to_identifier
    assert_equal TestBlogPost._one_to_many_to_identifier(:author), :writer_id
  end
  
  ################################################
  # Test Accessor methods defined properly
  ################################################
  def test_accessors_for_one_to_many_attr
    assert_equal TestBlogPost.public_method_defined?(:author), true
    assert_equal TestBlogPost.public_method_defined?("author="), true
    post = TestBlogPost.new({})
    author = TestWriter.new({})
    post.author= author
    assert_equal author, post.author 
    assert_equal true, (author.test_blog_posts.include? post)
  end
  
  #################################################
  # What I would like to do now is test if I created a record with a has_one attr 
  # will it be saved and afterwards accessed properly
  #################################################
  # Test creation, retrieval of a record with a has_one attribute
  # Delete the record post creation
  def set_up_new_records
    @author_attrs = {x: 1, y: 2}
    @author = TestWriter.new(@author_attrs)
    @post_attrs = {x: 1, y: 2}
    @post = TestBlogPost.new(@post_attrs)    
  end
  
  def delete_test_records
    TestModel.delete(@author[:id]) 
    TestBlogPost.delete(@post[:id]) 
  end
    
  # Save case 1:
  #   Relation is defined with :one_to_many attributes in both classes
  #   Both records are newly created records
  #   Expected Behaviour : 
  #     Saving one object cascade the saving on the relation attribute and saves it too
  def test_save_case_1
    set_up_new_records
    @post.author= @author
    @post.save
    # Here we should retrieve both records and actually find them
    post = TestBlogPost.get(@post[:id])
    author = TestWriter.get(@author[:id])
    # Make sure that the record attributes for both records
    # are both retrieved successfully
    assert_equal @post.attributes, post.attributes
    assert_equal @author.attributes, author.attributes
    # Make sure that the one_to_one attr was retrieved successfully
    assert_instance_of TestWriter, post.author
    assert_equal post.author.attributes, @author.attributes
    # Make sure also that the associated field in the one_to_one record was set correctly
    assert_equal true, (author.test_blog_posts.include? post)
    # Make sure that the id of the attribute is successfuly set in the attributes hashog
    assert_equal post.attributes[:writer_id], @author.attributes[:id]
    # Post finish: Delete the created records
    delete_test_records
  end
 
  # Save case 2:
  #   Relation is defined with :one_to_many attributes in both classes
  #   Writer object already saved. Post object newly created
  #   Expected Behaviour : 
  #     Writer object is adjusted properly once relation is set
  def test_save_case_2
    set_up_new_records
    @author.save
    author = TestWriter.get(@author[:id])
    # Set the blog.owner to owner & check that relation is set correctly
    @post.author= author
    assert_equal author, @post.author
    assert_equal true, (author.test_blog_posts.include? @post)
    assert_equal author.attributes[:id], @post.attributes[:writer_id]
    # Save the blog and make sure that everything is correct after saving
    # Here we should retrieve both records and actually find them
    @post.save
    saved_post = TestBlogPost.get(@post[:id])
    saved_author = TestWriter.get(@author[:id])
    # make sure that one_to_one attrs are set correctly 
    assert_equal saved_author.attributes[:id], saved_post.attributes[:writer_id]
    assert_equal true, (author.test_blog_posts.include? saved_post)
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
    @author2_attrs = {x: 1, y: 2}
    @author2 = TestWriter.new(@author2_attrs)
    @post.author= @author
    @post.save
    @author2.save
    # Set the blog.owner to owner2 & check that relation is set correctly
    post = TestBlogPost.get(@post[:id])
    post.author= @author2
    assert_equal true, (@author2.test_blog_posts.include? @post)
    assert_equal @author2.attributes[:id], post.attributes[:writer_id]
    # Here we should retrieve both records and actually find them
    # Save the blog and make sure that everything is correct after saving
    post.save
    saved_post = TestBlogPost.get(post[:id])
    saved_author = TestWriter.get(@author2[:id])
    old_author = TestWriter.get(@author[:id])
    # make sure that one_to_one attrs are set correctly 
    assert_equal saved_author.attributes[:id], saved_post.attributes[:writer_id]
    assert_equal true, (saved_author.test_blog_posts.include? saved_post)
    assert_equal saved_author.attributes[:id], saved_post.author.attributes[:id]
    # make sure that the old owner got updated correctly
    (old_author.test_blog_posts.include? saved_post)
    assert_equal false, (old_author.test_blog_posts.include? saved_post)
  end

end


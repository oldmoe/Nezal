Dir.chdir("lib") { require 'data_store' }
require 'require_all'
require_all 'test/models/'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize

MiniTest::Unit.autorun

class TestBlogPost 
  one_to_many :test_writer, :class_name => :TestWriter, :as => :blog_posts, :identified_by => :writer_id
end

class TestWriter 
  many_to_one :blog_posts, :class_name => :TestBlogPost, :foreign_key => :writer_id
end

class ManyToOneTest < MiniTest::Unit::TestCase
  
  ################################################
  # The following are methods used in initialization or creation of relations
  ################################################
  def test_many_to_one_associated_field_name
    assert_equal TestWriter._many_to_one_associated_field(:blog_posts), :test_writer
  end
  
  def test_many_to_one_to_foreign_key
    assert_equal TestWriter._many_to_one_to_foreign_key(:blog_posts), :writer_id
  end
  
  ################################################
  # Test Accessor methods defined properly
  ################################################
  def test_accessors_for_many_to_one_attr
    assert_equal TestWriter.public_method_defined?(:blog_posts), true
    assert_equal TestWriter.public_method_defined?("blog_posts="), true
    post = TestBlogPost.new({})
    author = TestWriter.new({})
    author.blog_posts << post
    assert_equal author, post.test_writer 
    assert_equal true, (author.blog_posts.include? post)
  end
  
  #################################################
  # What I would like to do now is test if I created a record with a many_to_one attr 
  # will it be saved and afterwards accessed properly
  #################################################
  # Test creation, retrieval of a record with a many_to_one attribute
  # Delete the record post creation
  def set_up_new_records
    @author_attrs = {x: 1, y: 2}
    @author = TestWriter.new(@author_attrs)
    @post_attrs = {x: 1, y: 2}
    @post1 = TestBlogPost.new(@post_attrs)
    @post2 = TestBlogPost.new(@post_attrs.dup)
  end
  
  def delete_test_records
    TestWriter.delete(@author[:id]) 
    TestBlogPost.delete(@post1[:id]) 
    TestBlogPost.delete(@post2[:id]) 
  end
    
  # Save case 1:
  #   Relation is defined with :many_to_one attributes in one class and 
  #   a one_to_many in the other.
  #   Both records are newly created records
  #   Expected Behaviour : 
  #     Saving the object with the many_to_one list and find that the list was also saved
  #     correctly and that the one_to_many attr "test_writer" inside them is set correctly
  def test_save_case_1
    set_up_new_records
    @author.blog_posts= [@post1]
    @author.blog_posts << @post2
    @author.save
    # Here we should retrieve both records and actually find them
    post1 = TestBlogPost.get(@post1[:id])
    post2 = TestBlogPost.get(@post2[:id])
    author = TestWriter.get(@author[:id])
    # Make sure that the record attributes for both records
    # are both retrieved successfully
    assert_equal @author.attributes, author.attributes
    assert_equal @post1.attributes, post1.attributes
    assert_equal @post2.attributes, post2.attributes
    # Make sure that the many_to_one attr was retrieved successfully
    assert_equal post1.test_writer.attributes, @author.attributes
    # Make sure also that the associated field in the one_to_one record was set correctly
    assert_equal true, (author.blog_posts.include? post1)
    assert_equal true, (author.blog_posts.include? post2)
    # Make sure that the id of the attribute is successfuly set in the attributes hashog
    assert_equal post1.attributes[:writer_id], @author.attributes[:id]
    # Post finish: Delete the created records
    delete_test_records
  end
 
  # Save case 2:
  #   Relation is defined with :many_to_one attribute
  #   Post object is already saved. Writer object then adds post to its 
  #   list
  #   Expected Behaviour : 
  #     Writer object is adjusted properly once relation is set
  #     Post object is adjusted properly once relation is set
  def test_save_case_2
    set_up_new_records
    @post1.save
    @post2.save
    post1 = TestBlogPost.get(@post1[:id])
    # Set the blog.owner to owner & check that relation is set correctly
    @author.blog_posts << post1
    assert_equal @author, post1.test_writer
    assert_equal true, (@author.blog_posts.include? post1)
    assert_equal @author.attributes[:id], post1.attributes[:writer_id]
    # Save the blog and make sure that everything is correct after saving
    # Here we should retrieve both records and actually find them
    @author.save
    saved_post = TestBlogPost.get(post1[:id])
    saved_author = TestWriter.get(@author[:id])
    # make sure that one_to_one attrs are set correctly 
    assert_equal saved_author.attributes[:id], saved_post.attributes[:writer_id]
    assert_equal true, (saved_author.blog_posts.include? saved_post)
    delete_test_records
  end

  # Delete:
  #   Add a record to the collection and save. Make sure it exists
  #   Delete the record, make sure it is deleted in memory
  #   Reload and make sure it doesn't exist
  def test_save_case_3
    set_up_new_records
    @author.blog_posts << @post1
    @author.save
    # Set the blog.owner to owner2 & check that relation is set correctly
    author = TestWriter.get(@author[:id])
    author.blog_posts.each { |rec| p rec}
    author.blog_posts.delete( @post1 )
    assert_equal false, (author.blog_posts.include? @post1)
    author.save
    author = TestWriter.get(author[:id])
    post1 = TestBlogPost.get(@post1[:id])
    assert_equal false, (author.blog_posts.include? @post1)
    assert_equal nil, post1.test_writer
  end

end




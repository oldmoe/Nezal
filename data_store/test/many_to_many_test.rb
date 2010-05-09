Dir.chdir("lib") { require 'data_store' }
require 'require_all'
require_all 'test/models/'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize

MiniTest::Unit.autorun

class TestBlogPost
  many_to_many :categories, :class_name => :TestCategory
end

class TestCategory
  many_to_many :test_blog_posts, :class_name => :TestBlogPost, :as => :categories
end

class ManyToManyTest < MiniTest::Unit::TestCase
  
  ################################################
  # The following are methods used in initialization or creation of relations
  ################################################
  def test_many_to_one_associated_field_name
    assert_equal TestBlogPost._many_to_many_associated_field(:categories), :test_blog_posts
    assert_equal TestCategory._many_to_many_associated_field(:test_blog_posts), :categories
  end
  
  ################################################
  # Test Accessor methods defined properly
  ################################################
  def test_accessors_for_many_to_many_attr
    assert_equal TestBlogPost.public_method_defined?(:categories), true
    assert_equal TestBlogPost.public_method_defined?("categories="), true
    post = TestBlogPost.new({})
    category = TestCategory.new({})
    post.categories= [category]
    assert_equal true, (post.categories.include? category)
    assert_equal true, (category.test_blog_posts.include? post)
  end
  
  #################################################
  # What I would like to do now is test if I created a record with a has_one attr 
  # will it be saved and afterwards accessed properly
  #################################################
  # Test creation, retrieval of a record with a has_one attribute
  # Delete the record post creation
  def set_up_new_records
    @category1_attrs = {name: :politics}
    @category2_attrs = {name: :movies}
    @category1 = TestCategory.new(@category1_attrs)
    @category2 = TestCategory.new(@category2_attrs)
    @post_attrs = {x: 1, y: 2}
    @post1 = TestBlogPost.new(@post_attrs)
    @post2 = TestBlogPost.new(@post_attrs.dup)        
  end
  
  def delete_test_records
    TestCategory.delete(@category1[:id])
    TestCategory.delete(@category2[:id])  
    TestBlogPost.delete(@post1[:id])
    TestBlogPost.delete(@post2[:id])  
  end

=begin
  # Save case 1:
  #   Relation is defined with :one_to_many attributes in both classes
  #   Both records are newly created records
  #   Expected Behaviour : 
  #     Saving one object cascade the saving on the relation attribute and saves it too
  def test_save_case_1
    set_up_new_records
    @post1.categories<< @category1
    @post1.categories<< @category2
    @post1.save
    @post2.save
    # Here we should retrieve both records and actually find them
    post = TestBlogPost.get(@post1[:id])
    category1 = TestCategory.get(@category1[:id])
    category2 = TestCategory.get(@category2[:id])
      # Make sure that the record attributes for both records
    # are both retrieved successfully
    assert_equal @category1.attributes, category1.attributes
    assert_equal @category2.attributes, category2.attributes
    assert_equal @post1.attributes, post.attributes
    # Make sure also that the associated field in the one_to_one record was set correctly
    assert_equal true, (category1.test_blog_posts.include? post)
    assert_equal true, (category2.test_blog_posts.include? post)
    assert_equal true, (post.categories.include? category1)
    assert_equal true, (post.categories.include? category2)
    # Post finish: Delete the created records
    delete_test_records
  end

  # Save case 2:
  #   Relation is defined with :many_to_many attributes in both classes
  #   Category object already saved. Post object newly created
  #   Expected Behaviour : 
  #     category object is adjusted properly once relation is set
  def test_save_case_2
    set_up_new_records
    @post1.categories<< @category1
    @post1.save
    @post2.save
    post1 = TestBlogPost.get(@post1[:id])
    post2 = TestBlogPost.get(@post2[:id])
    # Set the blog.owner to owner & check that relation is set correctly
    @category2.test_blog_posts << post1
    @category2.test_blog_posts << post2
    # Here we should retrieve both records and actually find them
    assert_equal true, (@category2.test_blog_posts.include? post1)
    assert_equal true, (@category2.test_blog_posts.include? post2) 
    assert_equal true, (post1.categories.include? @category1)
    assert_equal true, (post1.categories.include? @category2)
    assert_equal true, (post2.categories.include? @category2)
    @category2.save
    saved_post1 = TestBlogPost.get(@post1[:id])
    saved_post2 = TestBlogPost.get(@post2[:id])
    saved_category = TestCategory.get(@category2[:id])
    # make sure that one_to_one attrs are set correctly 
    assert_equal true, (saved_category.test_blog_posts.include? saved_post1)
    assert_equal true, (saved_category.test_blog_posts.include? saved_post2) 
    assert_equal true, (saved_post1.categories.include? @category1)
    assert_equal true, (saved_post1.categories.include? saved_category)
    assert_equal true, (saved_post2.categories.include? saved_category)
    delete_test_records
  end
=end
 
  # Delete:
  #   Add a record to the collection and save. Make sure it exists
  #   Delete the record, make sure it is deleted in memory
  #   Reload and make sure it doesn't exist
  def test_save_case_3
    set_up_new_records
    @post1.categories << @category1
    @post1.save
    @post2.categories << @category1
    @post2.save
    # Set the blog.owner to owner2 & check that relation is set correctly
    post1 = TestBlogPost.get(@post1[:id])
    post2 = TestBlogPost.get(@post2[:id])
    category1 = TestCategory.get(@category1[:id])
    post1.categories.each { |rec| p rec}
    post1.categories.delete( @category1)
    # Before save and reload .. category1 still holds post1
    assert_equal false, (post1.categories.include? category1)
    assert_equal true, (category1.test_blog_posts.include? @post1)
    assert_equal true, (category1.test_blog_posts.include? @post2)
    # Here we should retrieve both records and actually find them
    # Save the blog and make sure that everything is correct after saving
    post1.save
    saved_post = TestBlogPost.get(post1[:id])
    saved_category = TestCategory.get(category1[:id])
    # make sure that one_to_one attrs are set correctly 
    assert_equal false, (saved_post.categories.include? category1)
    assert_equal false, (saved_category.test_blog_posts.include? post1)
    assert_equal true, (saved_category.test_blog_posts.include? @post2)
  end

end


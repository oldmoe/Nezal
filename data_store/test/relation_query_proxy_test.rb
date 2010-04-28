require 'lib/data_store'
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

class RelationQueryTest < MiniTest::Unit::TestCase

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

  def test_where
    puts "-------- Begin: Test Where"
    set_up_new_records
    @author.blog_posts= [@post1]
    @author.blog_posts << @post2
    @author.save
    @author.blog_posts.where(id: @post1[:id]).each { |obj| p obj }
    @author.blog_posts.where(){true}.each { |obj| p obj }
    puts "-------- End: Test Where"
  end

end

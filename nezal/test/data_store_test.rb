require 'minitest/unit'

MiniTest::Unit.autorun

class DataStoreTest < MiniTest::Unit::TestCase

  def setup
    ENV["environment"] = "test"
    require 'config/loader.rb'
    require 'test/test_model'
  end

  def teardown
  end  
  
  def test_create_new_records
    @tm = TestModel.create({x: 1, y: 2})
    assert_equal @tm.class, TestModel   
  end

  def test_create_another_new_record
    @tm = TestModel.create({x: 1, y: 2})
    assert_equal @tm.class, Hash   
  end

  
end


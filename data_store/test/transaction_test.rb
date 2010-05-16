Dir.chdir("lib") { require 'data_store' }
require 'test/models/test_model'
require 'minitest/unit'

ENV["environment"] = "test"
DataStore::Database.initialize

MiniTest::Unit.autorun

class TransactionTest < MiniTest::Unit::TestCase
  
  # Test transaction is nil with if no start is called
  def test_current_txn_without_start
    assert_nil DataStore::Transaction::current
  end
  
  # Test transaction is nil with if no start is called
  def test_current_txn_with_start
    DataStore::Transaction::start
    assert_instance_of Bdb::Txn, DataStore::Transaction::current
    DataStore::Transaction::abort
  end  
  
  # Create Trannsaction
  # Create a record and save the transaction
  # Changes should be submitted
  def test_transaction_commit_cycle
    DataStore::Transaction::start
    @attributes = {x: 1, y: 2}
    @record = TestModel.create(@attributes)    
    DataStore::Transaction::commit    
    saved_rec = TestModel.get(@record[:id])
    assert_equal @record.attributes, saved_rec.attributes
    TestModel.delete(@record[:id])
  end

  # Create Trannsaction
  # Create a record and abort the transaction
  # Changes should be rolled back
  def test_transaction_abort_cycle
    DataStore::Transaction::start
    @attributes = {x: 1, y: 2}
    @record = TestModel.create(@attributes)      
    saved_rec = TestModel.get(@record[:id])
    assert_equal @record.attributes, saved_rec.attributes
    DataStore::Transaction::abort
    assert_nil TestModel.get(@record[:id])
    TestModel.delete(@record[:id])
  end
  
  
  # Created nested transactions
  # Commit the child transaction
  # Abort the parent transaction
  # Child transaction commit should be rolled back
  def test_nested_transaction_abort_cycle
    @attributes = {x: 1, y: 2}
    @record = TestModel.create(@attributes)      
    DataStore::Transaction::start
    saved_rec = TestModel.get(@record[:id])
    assert_equal @record.attributes, saved_rec.attributes
    DataStore::Transaction::start
    saved_rec[:x]= 5
    saved_rec.save
    DataStore::Transaction::commit
    saved_rec = TestModel.get(@record[:id])
    assert_equal 5, saved_rec[:x]    
    DataStore::Transaction::abort
    saved_rec = TestModel.get(@record[:id])
    assert_equal @record.attributes, saved_rec.attributes
    TestModel.delete(@record[:id])
  end
  
end


module DataStore

  class Transaction
  
    def self.init()
      @@opened_transactions = {}
    end
  
    def self.start(&block)
      if block_given?
        begin 
          txn = DataStore::Database::env.txn_begin(txn_stack.last, 0)
          txn_stack << txn
          block.call
          self.commit
        rescue Exception => e
          self.abort
          raise e, "Transaction aborted"
        end
      else
        txn = DataStore::Database::env.txn_begin(txn_stack.last, 0)
        txn_stack << txn
      end
    end
    
    def self.commit
      txn = txn_stack.pop
      txn.commit(0) if txn
    end
    
    def self.abort
      txn = txn_stack.pop
      txn.abort() if txn
    end
    
    def self.current
      txn_stack.last
    end
    
    def self.cleanup
      @@opened_transactions.each_pair do |key, value| 
        value.each { |txn| txn.abort() }
        value = []
      end
    end
  
    private
    def self.txn_stack
      @@opened_transactions[Thread.current.__id__] ||= []
    end

  end

end

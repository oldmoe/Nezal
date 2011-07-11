require 'bdb'
require 'msgpack'

module DataStore
  module Driver
    module Bdb

      class DB < GenericDriver

        attr_reader :store_name
      
        def initialize(store_name)
          @store_name = store_name
        end      

        def get(key)
          result = connection.get(transaction, key.to_s, nil, 0)
          result.nil? ? result : [key, result] 
        end

        def save(key, value)
          connection.put(transaction, key.to_s, value, 0)
        end

        def delete(key)
          connection.del(transaction, key.to_s, 0)
        end

        private

        def connection
          @conn ||= self.class.connect(store_name)
        end

        def transaction 
          self.class.transaction
        end

        class << self

          ENV_FLAGS = ::Bdb::DB_CREATE | # Create the environment if it does not already exist.
                    #::Bdb::DB_INIT_TXN  | # Initialize transactions
                    ::Bdb::DB_INIT_MPOOL  | # Initialize the in-memory cache.
                    ::Bdb::DB_INIT_CDB
                    #::Bdb::DB_INIT_LOCK   # Initialize locking.
  
          DB_OPEN_FLAGS = ::Bdb::DB_CREATE

          @@env = nil
          @@dbs = {}
          
          def env 
            if(!@@env)
              @@env = ::Bdb::Env.new(0)
              @@env.open('./db', ENV_FLAGS, 0)
              ObjectSpace.define_finalizer(self, proc {|id| disconnect() })
            end
            @@env
          end

          def connect(store_name)
            db = env.db       
            db.flags= flags
            @@dbs[store_name] ||= db.open(transaction, store_name, nil, ::Bdb::Db::BTREE, DB_OPEN_FLAGS, 0)
            @@dbs[store_name]
          end
          
          def disconnect()
            @@dbs.each_value { |db| db.close(0) }
            @@env.close 
          end

          def transaction
            nil
          end

          def flags 
            0
          end
        end

      end

      class InvertedIndex < DB
        
        def initialize(db_name, index_name)
          @store_name = "#{index_name}_#{db_name}"
        end

      end

      class Index < DB

        WRITABLE = ::Bdb::DB_WRITECURSOR

        def initialize(db_name, index_name)
          @store_name = "#{db_name}_#{index_name}"
          @inverted_index = InvertedIndex.new(db_name, index_name)
        end

        def save(score, member)
          score = format(score) 
          member = member.to_s
          old_score = @inverted_index.get(member)
          @inverted_index.save(member, score)
          if old_score
            iterate(WRITABLE) do |cursor|
              cursor.get(old_score[1], old_score[0], ::Bdb::DB_GET_BOTH)
              cursor.del()    
            end
          end
          connection.put(transaction, score, member, 0)
        end

        def delete(member)
          member = member.to_s
          old_score = @inverted_index.get(member)
          @inverted_index.delete(member)
          iterate(WRITABLE) do |cursor|
            cursor.get(old_score, member, ::Bdb::DB_GET_BOTH)
            cursor.del
          end
        end

        def after(score, member, count=1)
          result = []
          iterate(WRITABLE) do |cursor|
            cursor.get(format(score), member.to_s, ::Bdb::DB_GET_BOTH)  
            count.times do 
              record =  cursor.get(nil, nil, ::Bdb::DB_NEXT)  
              record.nil? ? break : result << record[1]
            end
          end                    
          result
        end

        def before(score, member, count=1)
          result = []
          iterate(WRITABLE) do |cursor|
            cursor.get(format(score), member.to_s, ::Bdb::DB_GET_BOTH)  
            count.times do 
              record =  cursor.get(nil, nil, ::Bdb::DB_PREV)  
              record.nil?  ? break : result << record[1]
            end
          end                    
          result
        end

        def iterate(writable=0)
          cursor = connection.cursor(transaction, writable)
          begin
            yield cursor
          ensure
            cursor.close
          end
        end

        private :iterate

        class << self
          def flags 
            ::Bdb::DB_DUP
          end
        end

      end
  
    end
  end  
end


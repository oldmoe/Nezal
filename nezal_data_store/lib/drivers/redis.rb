require 'redis'

module DataStore
  module Driver
    module Redis 
      class DB < GenericDriver
	
        SEP = "[:]".freeze
        
        attr_reader :store

        def initialize(store)
          @store = store
        end

        def connection
          @conn = ::Redis.new()
        end
        	  
        def get(key)
          result = connection.get(generate_key(store, key))
          if result
      		  return [key, result]
          end
      		return nil
        end

        def save(key, value)
          connection.set(generate_key(store, key), value)
        end
	    
        def delete(key)
          connection.del(generate_key(store, key))
        end
        
        private
                	  
	      def generate_key(*items)
		      items.join(SEP)
        end
      end

      class Index

        SEP = "[:]"
        
        attr_reader :store_name

        def initialize(db_name, index_name)
          @store_name = "#{index_name}#{SEP}#{db_name}".freeze
        end

        def connection
          @conn = ::Redis.new()
        end

        def save(score, member)
          connection.zadd(store_name, score, member)
        end

        def delete(member)
          connection.zrem(store_name, member)
        end      

        def before(score, member, count=1)
		      rank = connection.zrevrank(store_name, member)
		      connection.zrevrange(store_name, rank+1, rank+count).reverse	
        end

        def first(count=1)
		      connection.zrange(store_name, 0, count)	
        end

        def last(count=1)
		      connection.zrevrange(store_name, 0, count)	
        end

      end

    end
  end  
end

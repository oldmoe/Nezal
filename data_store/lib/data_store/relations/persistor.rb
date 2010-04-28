module DataStore

  module Relation
    
    class Persistor
      
      def self.initialize
        @@dbs = {}
      end
      
      def self.find(db_name, key, value=nil)
        records = []
        cursor = handler(db_name).cursor(nil, 0)
        if value
          result =  cursor.get( key, value, Bdb::DB_GET_BOTH_RANGE )
          if result == value
            cursor.close()
            return [result]
          end
        else
          result =  cursor.get( key, nil, Bdb::DB_SET_RANGE)
          while result && result[0] == key
            records << result[1]
            result =  cursor.get(nil, nil, Bdb::DB_NEXT)
          end
          cursor.close()
          return records
        end
      end
      
      def self.create(db_name, key, value)
        cursor = handler(db_name).cursor(nil, 0)
        result =  cursor.get( key, value, Bdb::DB_GET_BOTH_RANGE )
        handler(db_name).put(nil, key, value, 0) unless result && result[1] == value 
        cursor.close()
      end
      
      def self.delete(db_name, key, value=nil )
        cursor = handler(db_name).cursor(nil, 0)
        if value
          result =  cursor.get( key, value, Bdb::DB_GET_BOTH_RANGE )
          if result && result[1] == value
            cursor.del()
          end
        else
          result =  cursor.get( key, nil, Bdb::DB_NEXT)
          while result && result[0] == key
            cursor.del()  
            cursor.get(key, nil, Bdb::DB_NEXT)
          end
        end
        cursor.close()
      end
      
      def self.handler(db_name)
        @@dbs[db_name] ||= DataStore::Database::open(db_name, :flags => Bdb::DB_DUP | Bdb::DB_DUPSORT)
      end
      
    end
    
  end
  
end

module DataStore

  module CRUD
        
    def create(attributes)
      self.new(attributes).save
    end
    
    def delete(id)
      db_handle.del(nil, id, 0)
    end
    
    def get(id)
      result = db_handle.get(nil, id, nil, 0)
      obj = result ? self.new( retrieve(restore(result).merge({:id => id})) ).saved : nil
    end
    
    def find(id)
      values = []
      begin
        cursor = db_handle.cursor(nil, 0)
        result =  cursor.get(id, nil, Bdb::DB_SET_RANGE ) 
        result = cursor.get(nil, nil, Bdb::DB_NEXT) if result[0] == id
        while result
          if result[0].index(id)==0
            obj = restore(result[1])
            obj[:id] = result[0]
            values << self.new( retrieve(obj) )
            result = cursor.get(nil, nil, Bdb::DB_NEXT)
          else
            break
          end
        end
      rescue Exception => e
        puts e.backtrace
        puts e
        #TODO There should be some error handling in here we will see
        cursor.close
      end
      cursor.close
      values
    end
    
    def db_handle
      @db_handle ||= Database::open(db_name)
    end
    
    def dump(object)
      Marshal.dump(object)
    end
  
    def restore(data)
      Marshal.load(data)
    end
    
    def db_name= (name)
      @db_name = name
    end
    
    def db_name
      @db_name || self.name
    end
        
    def retrieve(hash)
      result = hash.dup
      result.each_pair do |key, value|
        if value.is_a? RelationIdentifier
          klass = Kernel.const_get(value.class_name)
          if value.list? 
            result[key] = klass.find(hash[:id])
          else
            result[key] = klass.get(value.id)
          end
        else
          result[key] = value
        end          
      end
      result
    end
    
  end
  
end

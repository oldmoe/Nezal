module DataStore

  module CRUD
        
    def create(attributes)
      self.new(attributes).save
    end
    
    def delete(id)
      DataStore::Transaction::start do 
        _delete_relations(id)
        db_handle.del(Transaction::current, id, 0)
      end
    end
    
    def get(id)
      result = db_handle.get(Transaction::current, id, nil, 0)
      obj = result ? self.new( retrieve(restore(result).merge({:id => id})) ).saved : nil
      obj._unmapped_relations= obj.attributes.delete(:relations) unless obj.nil?
      obj
    end
    
    def truncate()
      DataStore::Transaction::start do 
        db_handle.truncate(Transaction::current)
        @sequence  = nil if instance_variable_defined? :@sequence
      end
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
        result[key] = value
      end
      result
    end
    
  end
  
end

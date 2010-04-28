module DataStore

  module Storable
    SEPARATOR = ":"
  
    def self.included(base)
      base.extend(Enumerable) 
      base.extend(DataStore::CRUD)
      base.extend(DataStore::QueryAPI)
      base.send(:include, DataStore::Relation)  
    end  
  
    def save
      attributes[:id] ||= self.class.generate(self)
      saved
      relations = _save_relations
      storable = attributes.merge({:relations => _unmapped_relations})
      self.class.db_handle.put(nil, attributes[:id], self.class.dump(storable), 0)
      self  
    end
    
    def _save
      attributes[:id] ||= self.class.generate(self)
      saved
      storable = attributes.merge({:relations => _unmapped_relations})
      self.class.db_handle.put(nil, attributes[:id], self.class.dump(storable), 0)
      self  
    end
    
    def destroy
      self._delete_relations()
      self.class.db_handle.del(nil, @attributes[:id], 0)
    end
    
    def attributes
      @attributes
    end
    
    def attributes= (hash)
      @attributes = hash
    end
    
    def [](key)
      @attributes[key]
    end
    
    def []= (key, value)
      modified
      @attributes[key] = value
    end
    
    def saved?
      instance_variable_defined?(:@__dirty__) && !@__dirty__
    end
    
    def dirty?
      instance_variable_defined?(:@__dirty__)? @__dirty__ : @__dirty__ = true
    end
    
    def saved
      @__dirty__ = false
      self
    end
    
    def modified
      @__dirty__ = true
      self
    end
  
  end
    
end

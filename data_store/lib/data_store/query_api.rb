module DataStore 

  module QueryAPI
  
    def each()
      QueryProxy.new(db_name).each { |obj| yield obj }
    end
    
    def where(*args, &block)
      QueryProxy.new(db_name).where(*args, &block)
    end
    
    def order(*args, &block)
      QueryProxy.new(db_name).order(*args, &block)
    end
    
    def limit(offset = 0, number)
      QueryProxy.new(db_name).limit(offset = 0, number)
    end
  
  end

end

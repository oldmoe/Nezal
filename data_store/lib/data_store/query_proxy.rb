module DataStore

  class QueryProxy
    
    ErrorMsg = "Method recieves a Hash or a block as condition"
    
    attr_accessor :result_set
    
    def initialize(name)
      @name = name
      @state = { :limit => nil, :conditions => [], :ordering => [] }
      @result_set = []
    end
    
    def clone()
      cloned = self.dup
    end

    def where(*args, &block)
      conditions = args
      # Check the arguements and turn them into conditions
      if (conditions.empty? && !block_given?) || ( conditions.length > 0  && !(conditions[0].is_a? Hash))
        puts block
        raise ArgumentError, ErrorMsg 
      end
      if conditions[0]
        conditions[0].each_pair do |key, value|
          @state[:conditions] << Proc.new { |object|
            object[key] == value
          }        
        end
      end
      @state[:conditions] << block if block_given?
      return clone
    end
    
    def order(*args, &block)
      orders = args
      # Check the arguements and turn them into conditions
      if (orders.empty? && !block_given?)
        raise ArgumentError, ErrorMsg 
      end
      orders[0].each do |key|
        @state[:ordering] << Proc.new { |obj1, obj2|
          obj1 <=> obj2
        }        
      end
      @state[:ordering] << block if block_given?
    end
    
    def limit(offset = 0, number)
    end
    
    def each 
      execute
      @result_set.each { |obj| yield obj }
    end
    
    def execute
      begin
        klass = Kernel.const_get(@name)
        cursor = klass.db_handle.cursor(nil, 0)
        result =  cursor.get(nil, nil, Bdb::DB_NEXT)
        while result
          if result[0] == @name + "_seq"
            break
          end
          obj = klass.restore(result[1])
          obj[:id] = result[0]
          required = true
          @state[:conditions].each { |condition| required &&= condition.call(obj) }
          @result_set << obj if required
          result =  cursor.get(nil, nil, Bdb::DB_NEXT)
        end
      rescue Exception => e
        puts e.backtrace
        puts e
      ensure 
        cursor.close
      end  
      # Here should be the ordering    
    end
    
  end
  
end

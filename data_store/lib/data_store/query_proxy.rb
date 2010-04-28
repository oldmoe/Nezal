module DataStore

  class QueryProxy
    
    ErrorMsg = "Method recieves a Hash or a block as condition"
    
    attr_accessor :state
    attr_reader :name
    attr_accessor :result_set
    
    def initialize(name)
      @name = name
      @state = { :limit => nil, :conditions => [], :ordering => [] }
      @result_set = []
    end
    
    def initialize_copy(copy)
      @name = copy.name
      @state = copy.state.dup
      @result_set = copy.result_set.dup
    end
    
    def clone()
      cloned = self.dup
      cloned
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
          if value.is_a? Range
            @state[:conditions] << Proc.new { |object|
              value.include? object[key]
            }        
          else
            @state[:conditions] << Proc.new { |object|
              object[key] == value
            }        
          end
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
      orders.each do |key|
        index = @state[:ordering].length + 1
        @state[:ordering] << Proc.new { |obj1, obj2|
          result = (obj1[key] <=> obj2[key])
          if result == 0 && @state[:ordering][index]
            result = @state[:ordering][index].call(obj1, obj2)
          end
          result
        }        
      end
      @state[:ordering] << block if block_given?
      return clone
    end
    
    def limit(offset = 0, number)
      @state[:limit] = offset + number
      execute
      cloned = clone()
      cloned.state = { :limit => nil, :conditions => [], :ordering => [] }
      cloned
    end
    
    def each 
      execute
      @result_set.each { |obj| yield obj }
    end
    
    def execute
      if !@result_set.empty?
        new_result_set = []
        @result_set.each do |obj|
          required = true
          @state[:conditions].each { |condition| required &&= condition.call(obj) }
          new_result_set << obj if required
        end
        @result_set = new_result_set
        # Here should be the ordering
        if @state[:ordering].length > 0 
          @result_set = @result_set.sort { |obj1, obj2|   
            @state[:ordering][0].call(obj1, obj2)
          }
        end
        return
      end

      begin
        klass = Kernel.const_get(@name)
        cursor = klass.db_handle.cursor(nil, 0)
        result =  cursor.get(nil, nil, Bdb::DB_NEXT)
        while result
          if @state[:limit] && @result_set.length > @state[:limit]-1
            break
          end
          if result[0] == @name + "_seq"
            break
          end
          obj = klass.restore(result[1])
          obj[:id] = result[0]
          required = true
          @state[:conditions].each { |condition| required &&= condition.call(obj) }
          @result_set << klass.new(obj) if required
          result =  cursor.get(nil, nil, Bdb::DB_NEXT)
        end
      rescue Exception => e
        puts e.backtrace
        puts e
      ensure 
        cursor.close
      end  
      # Here should be the ordering
      if @state[:ordering].length > 0 
        @result_set = @result_set.sort { |obj1, obj2|   
          @state[:ordering][0].call(obj1, obj2)
        }
      end
    end
    
  end
  
end

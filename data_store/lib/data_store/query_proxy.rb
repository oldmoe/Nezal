module DataStore

  class QueryProxy
    include Enumerable
    
    ErrorMsg = "Method recieves a Hash or a block as condition"
    
    attr_accessor :state
    attr_reader :name
    attr_accessor :result_set
    
    def initialize(name)
      @name = name
      @state = { :limit => nil, :conditions => [], :ordering => [], :executed => false }
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
      orders.each do | hash |
        key = hash.first[0]
        value = hash.first[1]
        index = @state[:ordering].length + 1
        if value == :ascending
          @state[:ordering] << Proc.new { |obj1, obj2|
            result = (obj1[key] <=> obj2[key])
            if result == 0 && @state[:ordering][index]
              result = @state[:ordering][index].call(obj1, obj2)
            end
            result
          }        
        else
          @state[:ordering] << Proc.new { |obj1, obj2|
            result = (obj2[key] <=> obj1[key])
            if result == 0 && @state[:ordering][index]
              result = @state[:ordering][index].call(obj1, obj2)
            end
            result
          }        
        end        
      end
      @state[:ordering] << block if block_given?
      return clone
    end
    
    def limit(offset = 0, number)
      @state[:limit] = { :offset => offset, :limit => number }
      execute
      cloned = clone()
      cloned.state = { :limit => nil, :conditions => [], :ordering => [], :executed => true }
      cloned
    end
    
    def each 
      execute
      @result_set.each { |obj| yield obj }
    end
    
    def execute
      if @state[:executed]
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
      @state[:executed] = true
      begin
        klass = Kernel.const_get(@name)
        cursor = klass.db_handle.cursor(nil, 0)
        result =  cursor.get(nil, nil, Bdb::DB_NEXT)
        while result
          if @state[:limit] && @result_set.length >= ( @state[:limit][:offset] + @state[:limit][:limit] )
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
      if @state[:limit]
        @result_set = @result_set[@state[:limit][:offset]..(@state[:limit][:offset]+@state[:limit][:limit]-1)] || []
      end   
    end
  end
  
end

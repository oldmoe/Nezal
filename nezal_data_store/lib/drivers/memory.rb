require 'rbtree'

module DataStore
  module Driver

    class Memory < GenericDriver
	
      def initialize
        @data = {}
      end
      
      def get(store, key)
        return nil unless @data[store]
        value = @data[store][key]
        [key, value]
      end

      def save(store, key, value, object)
        @data[store] ||= {}
        #value = serialize(value)
        if object.saved?
          old_object = object.class.get(key)
          if old_object
            object.indexes.each_pair do|index, hash|
              index_key = old_object.send(hash[:method])
              @data["#{index}_#{store}"].delete([index_key, key])
            end
          end
        end
        @data[store][key] = value
        object.indexes.each_pair do|index, hash|
          index_key = object.send(hash[:method])
          @data["#{index}_#{store}"] ||= RBTree.new
          @data["#{index}_#{store}"][[index_key, key]] = key
        end
      end

      def delete(store, key)
        @data[store].delete(key)
        object.indexes.each_pair do|index, hash|
          index_key = object.send(hash[:method])
          @data["#{index}_#{store}"].delete([index_key, key])
        end
      end

      def after(store, index, key, value, count=1)
        @data["#{index}_#{store}"].bound([key, value], @data["#{index}_#{store}"].last[0])[1,count].collect{|r|[value ,@data[store][r[1]]]}
      end

      def before(store, index, key, value, count=1)
        @data["#{index}_#{store}"].bound(@data["#{index}_#{store}"].first[0], [key, value])[-(count+1), count].collect{|r|[value, @data[store][r[1]]]}
      end
      
    end
  end  
end
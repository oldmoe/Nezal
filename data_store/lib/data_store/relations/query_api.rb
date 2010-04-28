module DataStore 

  module Relation

    module QueryAPI

      def each()
        QueryProxy.new(@name, self).each { |obj| yield obj }
      end
      
      def where(*args, &block)
        QueryProxy.new(@name, self).where(*args, &block)
      end
      
      def order(*args, &block)
        QueryProxy.new(@name, self).order(*args, &block)
      end
      
      def limit(offset = 0, number)
        QueryProxy.new(@name, self).limit(offset = 0, number)
      end
    
    end

  end

end

require 'msgpack'

module DataStore
  module Driver
    class GenericDriver

      private
      def serialize(obj)
        ::MessagePack.pack(obj)
      end
      def deserialize(string)
        ::MessagePack.unpack(string)
      end
	  
      def format(key)
        if key.is_a? Integer
          key = sprintf("%8s", key.to_s(36))
        end
        key
      end
      
    end
  end
end

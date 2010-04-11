module DataStore
  
  module Relation
    
    class RelationCollection
      
      attr_reader :_new
      attr_reader :_deleted
      attr_reader :collection
      
      def initialize(owner, name)
        @owner = owner
        @name = name
        @collection = []
      end
      
      def <<(record)
        @owner.modified
        @owner.update_associated_attr(@name, record)
        @collection << record
      end
      
      def delete(record)
        @owner.modified
        @collection.delete(record) do 
          @collection.delete_if { |item| item.attributes[:id] == record.attributes[:id] }
        end
      end

      def _add(record)
        @owner.modified
        @collection << record
      end

      
      def include?(record)
        @collection = @collection + @owner._load_relation_records(@name)
        included = if @collection.include? record
                     true
                   elsif ( @collection.index { |item| item.attributes[:id] == record.attributes[:id] } )
                     true
                   else
                     false
                   end
      end
      
      def eachhh 
        @collection__ = @owner.load_relation_records(@name)
        @collection__.each { |obj| yield obj }
      end

      def each
        @collection = @collection + @owner.load_relation_records(@name)
        #@collection__.each { |obj| yield obj }
        @collection.each { |obj| yield obj }
      end
      
    end  
    
  end
  
end

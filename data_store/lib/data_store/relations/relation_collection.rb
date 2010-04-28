module DataStore
  
  module Relation
    
    class RelationCollection
      include DataStore::Relation::QueryAPI
      include Enumerable
      
      attr_reader :_new
      attr_reader :collection
      attr_reader :_deleted
      attr_reader :owner
      attr_accessor :_reset
      
      def initialize(owner, name)
        @owner = owner
        @name = name
        @collection = []
        @_deleted = []
      end
      
      def <<(record)
        @owner.modified
        @owner.send( "_" + @name + "_append", record)
        @collection << record
      end
      
      def delete(record)
        @owner.modified
        @_deleted << record
        @owner.send( "_" + @name + "_remove", record)
        @collection.delete_if { |item| item.attributes[:id] == record.attributes[:id] } 
      end

      def _add(record)
        @owner.modified
        @collection << record
      end
      
      def _delete(record)
        @owner.modified
        @_deleted << record
        @collection.delete_if { |item| item.attributes[:id] == record.attributes[:id] } 
      end


      def include?(record)
        included = if (record[:id].nil? ) 
                    @collection.include? record
                  elsif ( self.where(id: record[:id]).each(){}.index { |item| item.attributes[:id] == record.attributes[:id] } )
                     true
                   else
                     false
                   end
      end
      
      def _each
        @collection.each { |obj| yield obj }
      end
      
      def _load_relation_records(attr_name)
        # We should like load the records from the DB to begin with 
        # then the each should work correctly and afterwards we check 
        # rest of the collection interface
        table_name = if @owner.class._many_to_one_hash.include? attr_name
                      @owner.class._many_to_one_table_name(attr_name)
                    else
                      @owner.class._many_to_many_table_name(attr_name) 
                    end
        klass = if @owner.class._many_to_one_hash.include? attr_name
                      @owner.class._many_to_one_hash[attr_name][:class]
                    else
                      @owner.class._many_to_many_hash[attr_name][:class]
                    end
        keys = []
        if @owner[:id]
          keys = DataStore::Relation::Persistor.find(table_name, @owner[:id] , nil)
        end
        records = []
        keys.each do |key| 
          records << klass.get(key)
        end
        records
      end
      
    end  
    
  end
  
end

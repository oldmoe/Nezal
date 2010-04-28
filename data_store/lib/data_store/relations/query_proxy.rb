module DataStore

  module Relation

    class QueryProxy < DataStore::QueryProxy
    
      def initialize(attr_name, relation)
        @owner = relation.owner
        @relation = relation
        @table_name = if @owner.class._many_to_one_hash.include? attr_name
                        @owner.class._many_to_one_table_name(attr_name)
                      else
                        @owner.class._many_to_many_table_name(attr_name) 
                      end
        @klass = if @owner.class._many_to_one_hash.include? attr_name
                  @owner.class._many_to_one_hash[attr_name][:class]
                else
                  @owner.class._many_to_many_hash[attr_name][:class]
                end
        super(@table_name) 
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
            @relation._deleted.each { |record| required &&= ( record[:id] != obj[:id]) }
            new_result_set << obj if required
          end
          @relation.collection.each do |obj| 
            required = true
            @state[:conditions].each { |condition| required &&= condition.call(obj) }
            @result_set << obj if required
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
        keys = []
        if @owner[:id] && !@relation._reset
          keys = DataStore::Relation::Persistor.find(@table_name, @owner[:id] , nil)
        end
        keys.each do |key|
          if @state[:limit] && @result_set.length > @state[:limit]-1
            break
          end
          obj = @klass.get(key)
          required = true
          @state[:conditions].each { |condition| required &&= condition.call(obj) }
          @relation._deleted.each { |record| required &&= ( record[:id] != obj[:id]) }
          @result_set << obj if required
        end  
        @relation.collection.each do |obj| 
          required = true
          @state[:conditions].each { |condition| required &&= condition.call(obj) }
          @result_set << obj if required
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
  
end

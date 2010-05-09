module DataStore

  module Relation
      
    module ManyToMany
    
      def self.included(base)
        base.extend ClassMethods
      end  
             
      def _save_many_to_many(record)
        self.class._many_to_many_hash.each_pair do | attr_name, attr_configs |        
          attribute = send(attr_name)
          associated_attr = self.class._many_to_many_associated_field(attr_name)
          # Delete all the records in the index if the collection was reset
          records = DataStore::Relation::Persistor.find(self.class._many_to_many_table_name(attr_name), self.attributes[:id] , nil) 
          if attribute._reset
            if attr_configs[:cascade] == :destroy || attr_configs[:cascade] == :delete
              records.each do |record|
                attr_configs[:class].delete(record)
                DataStore::Relation::Persistor.delete(self.class._many_to_many_reverse_table_name(attr_name), record, self.attributes[:id])
              end
            else         
              records.each do |record|
                DataStore::Relation::Persistor.delete(self.class._many_to_many_reverse_table_name(attr_name), record, self.attributes[:id])
              end
            end
            DataStore::Relation::Persistor.delete(self.class._many_to_many_table_name(attr_name), self.attributes[:id] , nil)
          else
            # Delete all the records in the deleted list
            if attr_configs[:cascade] == :destroy || attr_configs[:cascade] == :delete
              attribute._deleted.each do |record| 
                record.destroy 
                DataStore::Relation::Persistor.delete(self.class._many_to_many_table_name(attr_name), self.attributes[:id], record[:id])   
                DataStore::Relation::Persistor.delete(self.class._many_to_many_reverse_table_name(attr_name),  record[:id], self.attributes[:id])
              end
            else 
              attribute._deleted.each do |record|
                DataStore::Relation::Persistor.delete(self.class._many_to_many_table_name(attr_name), self.attributes[:id], record[:id])
                DataStore::Relation::Persistor.delete(self.class._many_to_many_reverse_table_name(attr_name),  record[:id], self.attributes[:id])
              end
            end
          end
          # Save the currently in memory records
          attribute._each do |record|
            if associated_attr 
              record.send("_add" , self) unless (record.send(associated_attr).include? self)
            end                
            record.save if (record && record.dirty?)
            DataStore::Relation::Persistor.create(self.class._many_to_many_table_name(attr_name), attributes[:id], record.attributes[:id])
            DataStore::Relation::Persistor.create(self.class._many_to_many_reverse_table_name(attr_name), record.attributes[:id], attributes[:id])
          end
        end
      end
      
      def _delete_many_to_many
        self.class._many_to_many_hash.each_pair do | attr_name, attr_configs |
          case attr_configs[:cascade]
          when :destroy
            attribute = send(attr_name)
            attribute.each do  |record| 
              record.destroy 
              DataStore::Relation::Persistor.delete(self.class._many_to_many_reverse_table_name(attr_name),  record[:id], self.attributes[:id])
            end
          when :delete
            ids = DataStore::Relation::Persistor.find(self.class._many_to_many_table_name(attr_name), self[:id] , nil)
            ids.each do |id|
              attr_configs[:class].delete(id) 
              DataStore::Relation::Persistor.delete(self.class._many_to_many_reverse_table_name(attr_name),  record[:id], self.attributes[:id])
            end
          else
            attr_configs[:class]._on_many_to_many_attr_delete(self.class._many_to_many_associated_field(attr_name), self)
          end
          DataStore::Relation::Persistor.delete(self.class._many_to_many_table_name(attr_name), self.attributes[:id] , nil)
        end
        self.class._many_to_many_notifiers[:on_delete].each_pair do |key, value|
          value._on_many_to_many_attr_delete(key, self)
        end
      end
    
      module ClassMethods
        
        def many_to_many( attr_name, configs = {} )
          _many_to_many_hash[attr_name] = configs
          _many_to_many_hash[attr_name][:class_name] ||= to_class_name(attr_name)
          _many_to_many_hash[attr_name][:as] ||= ActiveSupport::Inflector.tableize(self.name).to_sym
          _many_to_many_hash[attr_name][:cascade] ||= :nullify
          retry_times = 1
          begin
            to_class( _many_to_many_hash, attr_name )
            if _many_to_one_associated_field(attr_name).nil?
              _many_to_many_hash[attr_name][:class].attach_notifier( :many_to_many, :on_delete, attr_name, self)
            end
          rescue Exception => e
            Loader::load(_many_to_many_hash[attr_name][:class_name])
            retry if (retry_times -= 1) >=  0
          end
          _define_many_to_many_accessors(attr_name)
        end
        
        def _define_many_to_many_accessors(attr_name)
          # Define attribute getter.
          # Arguments : 
          #   force_reload : optional flag to force reload of the record from the database. Default value is false.
          module_eval %Q{
            def #{attr_name}(force_reload=false)
	            if @#{attr_name}.nil? || force_reload
                @#{attr_name} = RelationCollection.new(self, :#{attr_name}) 
              end
              @#{attr_name}
            end
          }
          # Define attribute setter
          module_eval %Q{
            def #{attr_name}=(attr_val)
              attr_val.each { |val| _#{attr_name}_append(val) }
              self.send( "_"+:#{attr_name}.to_s+"=", attr_val )
            end
          }
          module_eval %Q{
            def _#{attr_name}=(attr_val)
	            if !@#{attr_name}
	              @#{attr_name} = RelationCollection.new(self, :#{attr_name})
              end
              @#{attr_name}._reset= true
              if (attr_val.is_a?Array)
                attr_val.each do |element| 
                  @#{attr_name}._add(element) unless (@#{attr_name}.include? self)
                end
              end
              self.modified
            end
          }
          module_eval %Q{
            def _#{attr_name}_append(attr_val)
              associated_attr = self.class._many_to_many_associated_field(:#{attr_name})            
              if attr_val.class._many_to_many_hash.has_key? associated_attr
                attr_val.send(associated_attr.to_s)._add self unless (attr_val.send(associated_attr).include? self)
              end
            end
          }
          module_eval %Q{
            def _#{attr_name}_remove(attr_val)
              associated_attr = self.class._many_to_many_associated_field(:#{attr_name})            
              if attr_val.class._many_to_many_hash.has_key? associated_attr
                attr_val.send(associated_attr.to_s)._delete self
              end
            end
          }
        end
                
        def _many_to_many_associated_field(attr_name)
          _many_to_many_hash[attr_name][:associated_attr] ||= ->(){
            associated_field_name = _many_to_many_hash[attr_name][:as] 
            if _many_to_many_hash[attr_name][:class]._many_to_many_hash.has_key?(associated_field_name) &&
                  _many_to_many_hash[attr_name][:class]._many_to_many_hash[associated_field_name][:class_name] == self.name.to_sym
               return associated_field_name
            end
            nil
          }.call
        end
                
        # Returns a Hash containing all declarations of many_to_one attributes and their 
        # configurations to be used afterwards to save relation attrs  
        def _many_to_many_hash
          @_many_to_many_hash ||= {}
        end

        def _on_many_to_many_attr_delete(attr_name, attribute)
          records = DataStore::Relation::Persistor.find(_many_to_many_reverse_table_name(attr_name), attribute.attributes[:id] , nil)
          records.each do |record|
            DataStore::Relation::Persistor.delete(_many_to_many_table_name(attr_name), record, attribute.attributes[:id])
          end
        end
      
        # RelationCRUD#to_table_name Returns the table name to save many_to_many relation record.
        # Generate it, if not specifed by configs[:table_name]  
        def _many_to_many_table_name(attr_name)
          _many_to_many_hash[attr_name][:table_name] ||=  self.name + "_" + _many_to_many_hash[attr_name][:class_name]
        end

        # RelationCRUD#to_table_name Returns the table name to save many_to_many relation record.
        # Generate it, if not specifed by configs[:table_name]  
        def _many_to_many_reverse_table_name(attr_name)
          _many_to_many_hash[attr_name][:reverse_table_name] ||= _many_to_many_hash[attr_name][:class_name].to_s + "_" + self.name
        end


      end
      
    end
    
  end
  
end

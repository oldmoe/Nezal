module DataStore

  module Relation 
  
    module HasMany
    
      def self.included(base)
        base.extend ClassMethods
      end  
      
      def update_associated_attr(attr_name, record)
        associated_attr = self.class.many_associations_hash[attr_name][:associated_attr] ||= self.class.has_many_associated_field_name(attr_name)
        if record.class.single_associations_hash.has_key? associated_attr
          record.send( "_" + associated_attr.to_s + "=", self ) unless record.send(associated_attr) == self
        elsif record.class.many_associations_hash.has_key? associated_attr
          record.send( associated_attr.to_s)._add(self) unless record.send(associated_attr) == self
        end
      end
      
      def save_has_many_relations
        self.class.many_associations_hash.each_pair do | key, value |
          attr_list = self.send(key)
          attr_list.each do |attribute| 
            attribute.save if (attribute && attribute.dirty?)
            self.class.store_relation(key, self.attributes[:id], attribute[:id]) if attribute
          end
        end
      end
     
      def load_relation_records(attr_name)
        # We should like load the records from the DB to begin with 
        # then the each should work correctly and afterwards we check 
        # rest of the collection interface
        keys = []
        if self[:id]
          cursor = self.class.relation_db_handle(attr_name).cursor(nil, 0)
          result = cursor.get(self[:id], nil, Bdb::DB_SET_RANGE ) 
          while result
            keys << result[1]
            result = cursor.get(nil, nil, Bdb::DB_NEXT)
          end
        end
        records = []
        keys.each do |key| 
          klass = Kernel.const_get(self.class.many_associations_hash[attr_name][:class_name])
          records << klass.get(key)
        end
        records
      end
                  
      module ClassMethods
      
        # Declarator#has_many declares a one-to-many relation attribute. 
        # The first parameter is the name of the attribute.
        # The second, if present, represents the configurations of the attribute
        # The configurations currently supported are the following:
        #   :class_name : specify the attibute class. If not present, the class is derived as 
        #                 specified in the Declarator#to_class_name.
        #   :table_name : specify the table name at which the records for the one_to_many relation
        #                 record to be stored. If not present, the table name is generated from 
        #                 combining class_name & the attribute class_name as specified in Declarator#to_table_name
        def has_many( attr_name, configs = {} )
          many_associations_hash[attr_name] = configs
          many_associations_hash[attr_name][:class_name] ||=  to_class_name(attr_name)
          define_has_many_accessors(attr_name)
        end
      
        # Returns a Hash containing all the declared has_many attributes and their 
        # configurations to be used afterwards to save relation attrs    
        def many_associations_hash
          @_many_associations_hash ||= {}
        end
      
        def define_has_many_accessors(attr_name)
          module_eval %Q{
	          def #{attr_name}()
	            if @#{attr_name}.nil?
                @#{attr_name} = RelationCollection.new(self, :#{attr_name}) 
              end
              @#{attr_name}
	          end
	        }          
          class_eval %Q{
	          def #{attr_name}=(attr_val)
	            if !@#{attr_name}
	              @#{attr_name} = RelationCollection.new(self, :#{attr_name})
              end
              if (attr_val.is_a?Array)
                attr_val.each do |element| 
                  @#{attr_name} << element 
                end
              end
              @#{attr_name} = attr_val
	          end
	        }          
          class_eval %Q{
	          def _#{attr_name}=(attr_val)
	            if !@#{attr_name}
	              @#{attr_name} = RelationCollection.new(self, :#{attr_name})
              end
              if (attr_val.is_a?Array)
                attr_val.each do |element| 
                  @#{attr_name}._add(element)
                end
              end
	          end
	        }          	        
        end
        
        def has_many_associated_field_name(attr_name)
          hash = :many_associations_hash
          attr_configs = self.send(hash)[attr_name]
          if attr_configs
            associated_field_name = (attr_configs[:as] || 
                                       ActiveSupport::Inflector.singularize(ActiveSupport::Inflector.tableize(self.name))).to_sym
            attr_configs[:class] ||= Kernel.const_get(self.send(hash)[attr_name][:class_name])
            if attr_configs[:class].single_associations_hash.has_key?(associated_field_name) &&
                    attr_configs[:class].single_associations_hash[associated_field_name][:class_name] == self.name.to_sym
               return associated_field_name
            end
            associated_field_name = ActiveSupport::Inflector.pluralize(associated_field_name).to_sym
            if attr_configs[:class].many_associations_hash.has_key?(associated_field_name) &&
                    attr_configs[:class].many_associations_hash[associated_field_name][:class_name] == self.name.to_sym
               return associated_field_name
             end
          end
          nil
        end

        # RelationCRUD#save_relation Store the has_many attr be adding a record to each element
        # in the list to a table specified by RelationCRUD#to_table_name
        # The first attribute is the attr_name to save instance of. 
        # Second attribute id : the main object, defining the has_many attr, id, attr_id : the id
        # of the object in the has_many attr list to be saved
        def store_relation(attr_name, id, attr_id)
          relation_db_handle(attr_name).put(nil, id, attr_id, 0)
        end
      
        def delete_relation(id)
          db_handle.del(nil, id, 0)
        end
        
        def relation_db_handle(name)
          @rel_db_handles ||= {}
          @rel_db_handles[name] ||= Database::open(self.to_table_name(name), :flags => Bdb::DB_DUP)
        end
      
        # RelationCRUD#to_table_name Returns the table name to save ona_to_many relation record.
        # Generate it, if not specifed by configs[:table_name]  
        def to_table_name(attr_name)
          many_associations_hash[attr_name][:table_name] ||= self.name + "_" + attr_name
        end
        
        # Declarator#to_class_name Generates class name from a given attribute name
        def to_class_name(attr_name)
          ActiveSupport::Inflector.camelize(ActiveSupport::Inflector.singularize(attr_name)).to_sym
        end

      end
      
    end

  end
    
end

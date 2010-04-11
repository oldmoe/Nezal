module DataStore

  module Relation
      
    module ManyToOne
    
      def self.included(base)
        base.extend ClassMethods
      end  
             
      def _save_many_to_one(record)
        self.class._many_to_one_hash.each_pair do | attr_name, attr_configs |        
          attribute = send(attr_name)
          associated_attr = self.class._many_to_one_associated_field(attr_name)
          if associated_attr 
            if attribute && attribute.send(associated_attr) == self && (!attribute.attributes[attr_configs[:foreign_key]])
              attribute.send("_" + associated_attr.to_s + "=", self)
            end
          else
            attribute._unmapped_relations[attr_configs[:foreign_key]] = attributes[:id]
          end                
          attribute.save if (attribute && attribute.dirty?)
          if record && record.attributes[attr_configs[:identified_by]] && ( attribute.nil? ||
                     record.attributes[attr_configs[:identified_by]] !=  attribute.attributes[:id] ) &&
                     ( old_attr = attr_configs[:class].get(record.attributes[attr_configs[:identified_by]]) )
            old_attr.class._on_many_to_one_delete( associated_attr, record )
          end
        end
      end
      
      def _delete_many_to_one
        self.class._many_to_one_hash.each_pair do | attr_name, attr_configs |
          case attr_configs[:cascade]
          when :destroy
            attribute = send(attr_name) || attr_configs[:class].get(attributes[attr_configs[:identified_by]])
            attribute.destroy
          when :delete
            attr_configs[:class].delete( attributes[attr_configs[:identified_by]] ) if attributes[attr_configs[:identified_by]]
          end
        end
        self.class._many_to_one_notifiers[:on_delete].each_pair do |key, value|
          value._on_many_to_one_delete(key, self)
        end
      end
      
      def _unmapped_relations
        @_relations ||= {}
      end 
      
      def _unmapped_relations=(hash) 
        @_relations = hash
      end
      
      def _load_relation_records(attr_name)
        # We should like load the records from the DB to begin with 
        # then the each should work correctly and afterwards we check 
        # rest of the collection interface
        keys = []
        if self[:id]
          cursor = self.class._many_to_one_db_handle(attr_name).cursor(nil, 0)
          result = cursor.get(self[:id], nil, Bdb::DB_SET_RANGE ) 
          while result && result[0]==self[:id]
            keys << result[1]
            result = cursor.get(nil, nil, Bdb::DB_NEXT)
          end
        end
        records = []
        keys.each do |key| 
          records << self.class._many_to_one_hash[attr_name][:class].get(key)
        end
        records
      end

      
      module ClassMethods

        # ManyToOne#many_to_one declares a many_to_one relation attribute. 
        # The first parameter is the name of the attribute.
        # The second, if present, represts the configurations of the attribute 
        # The configurations currently supported:
        #   :class_name : specify the attibute class. If not present, the class is derived from the attr_name 
        #                 using Relation#to_class_name
        #   :as : specify the attribute name in the class of the attribute to be automatically set to self once the attribute
        #         is assocaited with the model.
        #         If not set, the :as is drived. The class of the attribute is searched for a one_to_many attribute with the name of 
        #         the class name and type of the class.
        #         Example should do better here:
        #           class Blog
        #             :one_to_many :owner 
        #           end
        #           class Writer
        #             :many_to_one :blog, :as => :owner
        #           end
        #           writer = Writer.new
        #           blog = Blog.new
        #           writer.blog= blog
        #         Now here, once the blog is set in the writer object, the blog.owner is automatically set to writer 
        #         If :as config is not present, the blog is searched for a one_to_one attr with the name :writer
        #             derived by the one_to_one_associated_field method
        #   :identified_by : specify the name for the attribute id added to the attributes hash.
        #   :foreign_key  : specify the foreign_key attribute to be added to the relation object
        #                   Example, continuing the previous example
        #                     class Writer
        #                       :one_to_one :blog, :as => :owner, :foreign_key => :owner_id
        #                     end    
        #                   This adds an attr named :owner_id to the blog attributes hash.
        #                   Please, take note that the foreign_key should be the same as the :identified_by definition in the assocaited object, 
        #                   if it exists.
        def many_to_one( attr_name, configs = {} )
          _many_to_one_hash[attr_name] = configs
          _many_to_one_hash[attr_name][:class_name] ||=  to_class_name(attr_name)
          _many_to_one_hash[attr_name][:as] ||=  ActiveSupport::Inflector.singularize(ActiveSupport::Inflector.tableize(self.name)).to_sym
          _many_to_one_hash[attr_name][:cascade] ||= :nullify
          _many_to_one_hash[attr_name][:foreign_key] = _many_to_one_to_foreign_key(attr_name)
          retry_times = 1
          begin
            to_class( _many_to_one_hash, attr_name )
            _many_to_one_hash[attr_name][:class].attach_notifier( :many_to_one, :on_delete, attr_name, self)
          rescue Exception => e
            require 'test/models/' + ActiveSupport::Inflector.singularize(ActiveSupport::Inflector.tableize(_many_to_one_hash[attr_name][:class_name])) + ".rb"
            retry if (retry_times -= 1) >  0
          end
          _define_many_to_one_accessors(attr_name)
        end
        
        def _define_many_to_one_accessors(attr_name)
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
              associated_attr = self.class._one_to_many_associated_field(:#{attr_name})
            end
          }
          module_eval %Q{
            def _#{attr_name}=(attr_val)
              self.modified
            end
          }
        end
                
        def _many_to_one_associated_field(attr_name)
          _many_to_one_hash[attr_name][:associated_attr] ||= ->(){
            associated_field_name = _many_to_one_hash[attr_name][:as] 
            if _many_to_one_hash[attr_name][:class]._one_to_many_hash.has_key?(associated_field_name) &&
                  _many_to_one_hash[attr_name][:class]._one_to_many_hash[associated_field_name][:class_name] == self.name.to_sym
               return associated_field_name
            end
            nil
          }.call
        end
                
        # Returns a Hash containing all declarations of many_to_one attributes and their 
        # configurations to be used afterwards to save relation attrs  
        def _many_to_one_hash
          @_many_to_one_hash ||= {}
        end
        
        def _many_to_one_to_foreign_key(attr_name)
          associated_attr_name = _many_to_one_hash[attr_name][:as].to_s
          _many_to_one_hash[attr_name][:foreign_key] ||= ( associated_attr_name + "_id" ).to_sym
        end

        def _on_many_to_one_attr_delete(attr_name, attribute)
          # That thing should actually go to the index and fetch all the ids
          # and then nullifies the attr inside them
          cursor = _many_to_one_db_handle(attr_name).cursor(nil, 0)
          id = if attribute.class._one_to_many_hash[_many_to_one_associated_field(attr_name)]
                attribute.attributes[attribute.class._one_to_many_hash[_many_to_one_associated_field(attr_name)][:identified_by]] 
              else
                attribute._one_to_many_unmapped_relations[_many_to_one[attr_name][:foreign_key]]
              end
          if id
            result =  cursor.get( id, attribute.attributes[:id], Bdb::DB_GET_BOTH_RANGE )
            cursor.del() if result == attribute.attributes[:id] 
          end
        end


        def _many_to_one_db_handle(name)
          @_many_to_one_db_handles ||= {}
          @_many_to_one_db_handles[name] ||= Database::open(_many_to_one_table_name(name), :flags => Bdb::DB_DUP | Bdb::DB_DUPSORT)
        end
      
        # RelationCRUD#to_table_name Returns the table name to save ona_to_many relation record.
        # Generate it, if not specifed by configs[:table_name]  
        def _many_to_one_table_name(attr_name)
          _many_to_one_hash[attr_name][:table_name] ||=  self.name + "_" + _many_to_one_hash[attr_name][:class_name]
        end
        

      end
    
    end
    
  end

end

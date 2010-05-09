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
          # Delete all the records in the index if the collection was reset
          if attribute._reset
            if attr_configs[:cascade] == :destroy || attr_configs[:cascade] == :delete
              attribute._load_relation_records(attr_name).each { |record| record.destroy }
            elsif associated_attr
              attribute._load_relation_records(attr_name).each do |record| 
                record.send("_" + associated_attr.to_s + "=", nil) 
                record._save
              end
            else
              attribute._load_relation_records(attr_name).each do |record|  
                record._unmapped_relations[attr_configs[:foreign_key]] = nil
                record._save
              end
            end
            DataStore::Relation::Persistor.delete(self.class._many_to_one_table_name(attr_name), self.attributes[:id] , nil)
          else
            # Delete all the records in the deleted list
            if attr_configs[:cascade] == :destroy || attr_configs[:cascade] == :delete
              attribute._deleted.each do |record| 
                record.destroy 
                DataStore::Relation::Persistor.delete(self.class._many_to_one_table_name(attr_name), self.attributes[:id] , record[:id])   
              end
            elsif associated_attr
              attribute._deleted.each do |record| 
                record.send("_" + associated_attr.to_s + "=", nil) 
                record.save
                DataStore::Relation::Persistor.delete(self.class._many_to_one_table_name(attr_name), self.attributes[:id] , record[:id])
              end
            else
              attribute._deleted.each do |record|  
                record._unmapped_relations[attr_configs[:foreign_key]] = nil
                record._save
                DataStore::Relation::Persistor.delete(self.class._many_to_one_table_name(attr_name), self.attributes[:id] , record[:id])
              end
            end
          end
          # Save the currently in memory records
          attribute._each do |attribute|
            if associated_attr 
              if attribute && attribute.send(associated_attr) == self && (!attribute.attributes[attr_configs[:foreign_key]])
                attribute.send("_" + associated_attr.to_s + "=", self)
              end
            else
              attribute._unmapped_relations[attr_configs[:foreign_key]] = attributes[:id]
            end             
            attribute.save if (attribute && attribute.dirty?)
            DataStore::Relation::Persistor.create(self.class._many_to_one_table_name(attr_name), attributes[:id], attribute.attributes[:id])
          end
        end
      end
      
      def _delete_many_to_one
        self.class._many_to_one_hash.each_pair do | attr_name, attr_configs |
          case attr_configs[:cascade]
          when :destroy
            attribute = send(attr_name)
            attribute.each{ |record| record.destroy }
          when :delete
            ids = DataStore::Relation::Persistor.find(self.class._many_to_one_table_name(attr_name), self[:id] , nil)
            ids.each { |id| attr_configs[:class].delete(id) }
          else
            attr_configs[:class]._on_one_to_many_attr_delete(self.class._many_to_one_associated_field(attr_name), self)
          end
          DataStore::Relation::Persistor.delete(self.class._many_to_one_table_name(attr_name), self.attributes[:id] , nil)
        end
        self.class._many_to_one_notifiers[:on_delete].each_pair do |key, value|
          value._on_one_to_many_attr_delete(key, self)
        end
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
            if _many_to_one_associated_field(attr_name).nil?
              _many_to_one_hash[attr_name][:class].attach_notifier( :many_to_one, :on_delete, attr_name, self) 
            end
          rescue Exception => e
            Loader::load(_many_to_one_hash[attr_name][:class_name])
            retry if (retry_times -= 1) >=  0
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
                  @#{attr_name}._add(element)
                end
              end
              self.modified
            end
          }
          module_eval %Q{
            def _#{attr_name}_append(attr_val)
              associated_attr = self.class._many_to_one_associated_field(:#{attr_name})            
              if attr_val.class._one_to_many_hash.has_key? associated_attr
                attr_val.send( "_" + associated_attr + "=",  self)
              end
            end
          }
          module_eval %Q{
            def _#{attr_name}_remove(attr_val)
              associated_attr = self.class._many_to_one_associated_field(:#{attr_name})            
              if attr_val.class._many_to_one_hash.has_key? associated_attr
                attr_val.send(associated_attr.to_s)._delete self
              end
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
          # That thing should actually go to the index and fetch the correct id of the many_to_one attr 
          # and remove the attribute from its list
          id = if attribute.class._one_to_many_hash[_many_to_one_associated_field(attr_name)]
                attribute.attributes[attribute.class._one_to_many_hash[_many_to_one_associated_field(attr_name)][:identified_by]] 
              else
                attribute._one_to_many_unmapped_relations[_many_to_one[attr_name][:foreign_key]]
              end
          if id
            DataStore::Relation::Persistor.delete(_many_to_one_table_name(attr_name), id, attribute.attributes[:id])
          end
        end
      
        # RelationCRUD#to_table_name Returns the table name to save many_to_one relation record.
        # Generate it, if not specifed by configs[:table_name]  
        def _many_to_one_table_name(attr_name)
          _many_to_one_hash[attr_name][:table_name] ||=  self.name + "_" + _many_to_one_hash[attr_name][:class_name]
        end

      end
    
    end
    
  end

end

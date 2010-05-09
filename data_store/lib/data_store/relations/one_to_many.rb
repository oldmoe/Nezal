module DataStore

  module Relation
      
    module OneToMany
    
      def self.included(base)
        base.extend ClassMethods
      end  
             
      def _save_one_to_many(record)
        self.class._one_to_many_hash.each_pair do | attr_name, attr_configs |        
          attribute = send(attr_name)
          associated_attr = self.class._one_to_many_associated_field(attr_name)
          if associated_attr && attribute && !(attribute.send(associated_attr).include? self)
            attribute.send(associated_attr.to_s)._add self
          end
          if attribute 
            attribute.save if attribute.dirty?
            attributes[attr_configs[:identified_by]] = attribute.attributes[:id]
            DataStore::Relation::Persistor.create(self.class._one_to_many_table_name(attr_name), attribute.attributes[:id], attributes[:id] )
          end
          if record && record.attributes[attr_configs[:identified_by]] && ( attribute.nil? ||
                     record.attributes[attr_configs[:identified_by]] !=  attribute.attributes[:id] )
            DataStore::Relation::Persistor.delete(self.class._one_to_many_table_name(attr_name), record.attributes[attr_configs[:identified_by]], self.attributes[:id] )
          end
        end
      end
      
      def _delete_one_to_many
        self.class._one_to_many_hash.each_pair do | attr_name, attr_configs |
          case attr_configs[:cascade]
          when :destroy
            attribute = send(attr_name) || attr_configs[:class].get(attributes[attr_configs[:identified_by]])
            attribute.destroy
          when :delete
            attr_configs[:class].delete( attributes[attr_configs[:identified_by]] ) if attributes[attr_configs[:identified_by]]
          else
            attr_configs[:class]._on_many_to_one_attr_delete(self.class._one_to_many_associated_field(attr_name), self)
          end
        end
        self.class._many_to_one_notifiers[:on_delete].each_pair do |key, value|
          value._on_many_to_one_attr_delete(key, self)
        end
      end
      
      def _one_to_many_unmapped_relations
        @_one_to_many_relations ||= {}
      end 
      
      def _one_to_many_unmapped_relations=(hash) 
        @_one_to_many_relations = hash
      end
      
      module ClassMethods

        # OneToMany#one_to_many declares a one-to-many relation attribute. 
        # The first parameter is the name of the attribute.
        # The second, if present, represts the configurations of the attribute 
        # The configurations currently supported:
        #   :class_name : specify the attibute class. If not present, the class is derived from the attr_name 
        #                 using Relation#to_class_name
        #   :as : specify the attribute name in the class of the attribute to be automatically associated with self once the attribute
        #         is assocaited with the model.
        #         If not set, the :as is drived. The class of the attribute is searched for a many_to_one attribute with the name of 
        #         the class name and type of the class.
        #         Example should do better here:
        #           class BlogPost
        #             :one_to_many :author
        #           end
        #           class Writer
        #             :many_to_one :blog_posts, :as => :author
        #           end
        #           writer = Writer.new
        #           blog = Blog.new
        #           writer.blog= blog
        #         Now here, once the blog is set in the writer object, the blog.owner is automatically set to writer 
        #         If :as config is not present, the blog is searched for a one_to_one attr with the name :writer
        #             derived by the _one_to_many_associated_field method
        #   :identified_by : specify the name for the attribute id added to the attributes hash.
        def one_to_many( attr_name, configs = {} )
          _one_to_many_hash[attr_name] = configs
          _one_to_many_hash[attr_name][:class_name] ||=  to_class_name(attr_name)
          _one_to_many_hash[attr_name][:as] ||= ActiveSupport::Inflector.tableize(self.name).to_sym
          _one_to_many_hash[attr_name][:cascade] ||= :nullify
          _one_to_many_hash[attr_name][:identified_by] = _one_to_many_to_identifier(attr_name)
          retry_times = 1
          begin
            to_class(_one_to_many_hash, attr_name)
            if _one_to_many_associated_field(attr_name).nil?
              _one_to_many_hash[attr_name][:class].attach_notifier( :one_to_many, :on_delete, attr_name, self)
            end
          rescue Exception => e
            Loader::load(_one_to_many_hash[attr_name][:class_name])
            retry if (retry_times -= 1) >  0
          end
          _define_one_to_many_accessors(attr_name)
        end
                
        # Returns a Hash containing all declarations of one_to_many attributes and their 
        # configurations to be used afterwards to save relation attrs  
        def _one_to_many_hash
          @_one_to_many_hash ||= {}
        end
        
        def _define_one_to_many_accessors(attr_name)
          # Define attribute getter.
          # Arguments : 
          #   force_reload : optional flag to force reload of the record from the database. Default value is false.
          module_eval %Q{
            def #{attr_name}(force_reload=false)
              if (@#{attr_name}.nil? || force_reload) && attributes[self.class._one_to_many_hash[:#{attr_name}][:identified_by]]
                @#{attr_name} = self.class._one_to_many_hash[:#{attr_name}][:class].get(attributes[self.class._one_to_many_hash[:#{attr_name}][:identified_by]])
                attributes[self.class._one_to_many_hash[:#{attr_name}][:identified_by]] = @#{attr_name}[:id]
              end
              @#{attr_name}
            end
          }
          # Define attribute setter
          module_eval %Q{
            def #{attr_name}=(attr_val)              
              associated_attr = self.class._one_to_many_associated_field(:#{attr_name})
              if attr_val.class._many_to_one_hash.has_key? associated_attr
                attr_val.send(associated_attr.to_s)._add self unless (attr_val.send(associated_attr).include? self)
              end
              self.send( "_"+:#{attr_name}.to_s+"=", attr_val )
            end
          }
          module_eval %Q{
            def _#{attr_name}=(attr_val)
              if attr_val
                attributes[self.class._one_to_many_hash[:#{attr_name}][:identified_by]] = attr_val.attributes[:id]
              else
                attributes[self.class._one_to_many_hash[:#{attr_name}][:identified_by]] = nil
              end
              @#{attr_name} = attr_val
              self.modified
            end
          }
        end
                
        def _one_to_many_associated_field(attr_name)
          _one_to_many_hash[attr_name][:associated_attr] ||= ->(){
            associated_field_name = _one_to_many_hash[attr_name][:as] 
            if _one_to_many_hash[attr_name][:class]._many_to_one_hash.has_key?(associated_field_name) &&
                  _one_to_many_hash[attr_name][:class]._many_to_one_hash[associated_field_name][:class_name] == self.name.to_sym
               return associated_field_name
            end
            nil
          }.call
        end

        def _one_to_many_to_identifier(attr_name)
          _one_to_many_hash[attr_name][:identified_by] ||= (attr_name.to_s + "_id").to_sym
        end
        
        def _on_one_to_many_attr_delete(attr_name, attribute)
          result = DataStore::Relation::Persistor.find(_one_to_many_table_name(attr_name), attribute.attributes[:id] , nil)
          result.each do |id|
            obj = get(id)
            obj.send("_" + attr_name.to_s + "=", nil)
            obj._save
            DataStore::Relation::Persistor.delete(_one_to_many_table_name(attr_name), attribute.attributes[:id] , id)
          end
        end
              
        # RelationCRUD#to_table_name Returns the table name to save ona_to_many relation record.
        # Generate it, if not specifed by configs[:table_name]  
        def _one_to_many_table_name(attr_name)
          _one_to_many_hash[attr_name][:table_name] ||=  _one_to_many_hash[attr_name][:class_name].to_s + "_" + self.name 
        end
        
      end
    
    end
    
  end

end

module DataStore
    
  module Relation
      
    module OneToOne
      
      def self.included(base)
        base.extend ClassMethods
      end  
             
      def _save_one_to_one(record)
        self.class._one_to_one_hash.each_pair do | attr_name, attr_configs |        
          attribute = send(attr_name)
          associated_attr = self.class._one_to_one_associated_field(attr_name)
          if associated_attr 
            if attribute && attribute.send(associated_attr) == self && (!attribute.attributes[attr_configs[:foreign_key]])
              attribute.send("_" + associated_attr.to_s + "=", self)
            end
          else
            attribute._unmapped_relations[attr_configs[:foreign_key]] = attributes[:id]
          end                
          attribute.save if (attribute && attribute.dirty?)
          if record && record.attributes[attr_configs[:identified_by]] && ( attribute.nil? ||
                     record.attributes[attr_configs[:identified_by]] !=  attribute.attributes[:id] )
            attr_configs[:class]._on_one_to_one_attr_delete( associated_attr, record )
          end
        end
      end
      
      def _delete_one_to_one
        # The first step is to delete the defined one_to_one attributes 
        self.class._one_to_one_hash.each_pair do | attr_name, attr_configs |
          case attr_configs[:cascade]
          when :destroy
            attribute = send(attr_name) || attr_configs[:class].get(attributes[attr_configs[:identified_by]])
            attribute.destroy
          when :delete
            attr_configs[:class].delete( attributes[attr_configs[:identified_by]] ) if attributes[attr_configs[:identified_by]]
          end
        end
        self.class._one_to_one_notifiers[:on_delete].each_pair do |key, value|
          value._on_one_to_one_attr_delete(key, self)
        end
      end
      
      def _unmapped_relations
        @_relations ||= {}
      end 
      
      def _unmapped_relations=(hash) 
        @_relations = hash
      end
        
      module ClassMethods
      
        # OneToOne#one_to_one declares a one-to-one relation attribute. 
        # The first parameter is the name of the attribute.
        # The second, if present, represts the configurations of the attribute 
        # The configurations currently supported:
        #   :class_name : specify the attibute class. If not present, the class is derived from the attr_name 
        #                 using OneToOne#to_class_name
        #   :as : specify the attribute name in the class of the attribute to be automatically set to self once the attribute
        #         is assocaited with the model.
        #         If not set, the :as is drived. The class of the attribute is searched for a one_to_one attribute with the name of 
        #         the class name and type of the class.
        #         Example should do better here:
        #           class Profile 
        #             include DataStore::Storable              
        #             :one_to_one :owner 
        #           end
        #           class Writer
        #             include DataStore::Storable
        #             :one_to_one :profile, :as => :owner
        #           end
        #           writer = Writer.new
        #           profile = Profile.new
        #           writer.profile= profile
        #         Now here, once the profile is set in the writer object, the profile.owner is automatically set to writer 
        #         If :as config is not present, the profile class is searched for a one_to_one attr with the name :writer
        #             derived by the _one_to_one_associated_field method
        #   :identified_by : specify the name for the attribute id added to the attributes hash.
        #   :foreign_key  : specify the foreign_key attribute to be added to the relation object
        #                   Example, continuing the previous example
        #                     class Writer
        #                       :one_to_one :profile, :as => :owner, :foreign_key => :owner_id
        #                     end    
        #                   This adds an attr named :owner_id to the profile attributes hash.
        #                   Please, take note that the foreign_key should be the same as the :identified_by definition in the assocaited object, 
        #                   if it exists.
        def one_to_one( attr_name, configs = {} )
          _one_to_one_hash[attr_name] = configs
          _one_to_one_hash[attr_name][:class_name] ||=  to_class_name(attr_name)
          _one_to_one_hash[attr_name][:as] ||=  ActiveSupport::Inflector.singularize(ActiveSupport::Inflector.tableize(self.name)).to_sym
          _one_to_one_hash[attr_name][:cascade] ||= :nullify
          _one_to_one_hash[attr_name][:foreign_key] = _one_to_one_to_foreign_key(attr_name)
          _one_to_one_hash[attr_name][:identified_by] = _one_to_one_to_identifier(attr_name)
          retry_times = 1
          begin
            to_class(_one_to_one_hash, attr_name)
            _one_to_one_hash[attr_name][:class].attach_notifier( :one_to_one, :on_delete, attr_name, self)
          rescue Exception => e
            require 'test/models/' + ActiveSupport::Inflector.singularize(ActiveSupport::Inflector.tableize(_one_to_one_hash[attr_name][:class_name])) + ".rb"
            retry if (retry_times -= 1) >  0
          end
          _define_one_to_one_accessors(attr_name)
        end

        # Returns a Hash containing all declarations of one_to_one attributes and their 
        # configurations to be used afterwards to save relation attrs  
        def _one_to_one_hash
          @_one_to_one_hash ||= {}
        end

        def _define_one_to_one_accessors(attr_name)
          module_eval %Q{
            def #{attr_name}(force_reload=false)
              if (@#{attr_name}.nil? || force_reload) && attributes[self.class._one_to_one_hash[:#{attr_name}][:identified_by]]
                @#{attr_name} = self.class._one_to_one_hash[:#{attr_name}][:class].get(attributes[self.class._one_to_one_hash[:#{attr_name}][:identified_by]])
                attributes[self.class._one_to_one_hash[:#{attr_name}][:identified_by]] = @#{attr_name}[:id]
              end
              @#{attr_name}
            end
          }
          module_eval %Q{
            def #{attr_name}=(attr_val)
              associated_attr = self.class._one_to_one_associated_field(:#{attr_name})
              if attr_val.class._one_to_one_hash.has_key? associated_attr
                attr_val.send( "_"+associated_attr.to_s+"=", self )
              else
                attr_val._unmapped_relations[self.class._one_to_one_hash[:#{attr_name}][:foreign_key]] = attributes[:id]                
              end
              self.send( "_"+:#{attr_name}.to_s+"=", attr_val )
            end
          }
          module_eval %Q{
            def _#{attr_name}=(attr_val)
              if attr_val 
                attributes[self.class._one_to_one_hash[:#{attr_name}][:identified_by]] = attr_val.attributes[:id]
              else
                attributes[self.class._one_to_one_hash[:#{attr_name}][:identified_by]] = nil
              end
              @#{attr_name} = attr_val
              self.modified
            end
          }
        end
                
        def _one_to_one_associated_field(attr_name)
          _one_to_one_hash[attr_name][:associated_attr] ||= ->(){
            associated_field_name = _one_to_one_hash[attr_name][:as]
            if _one_to_one_hash[attr_name][:class]._one_to_one_hash.has_key?(associated_field_name) &&
                    _one_to_one_hash[attr_name][:class]._one_to_one_hash[associated_field_name][:class_name] == self.name.to_sym
               return associated_field_name
            end
            nil
          }.call
        end
        
        def _one_to_one_to_identifier(attr_name)
          _one_to_one_hash[attr_name][:identified_by] ||= (attr_name.to_s + "_id").to_sym
        end
        
        def _one_to_one_to_foreign_key(attr_name)
          associated_attr_name = _one_to_one_hash[attr_name][:as].to_s
          _one_to_one_hash[attr_name][:foreign_key] ||= ( associated_attr_name + "_id" ).to_sym
        end
        
        def _on_one_to_one_attr_delete(attr_name, attribute)
          id = attribute.attributes[self._one_to_one_hash[attr_name][:foreign_key]] if self._one_to_one_hash[attr_name]
          if id && record = get(id)
            record.send( "_" + attr_name.to_s + "=",  nil)
            record._save
            return
          end
          id = attribute._unmapped_relations[_one_to_one_hash[attr_name][:foreign_key]]
          if id && record = db_handler.get(id)
            record._unmapped_relations[_one_to_one_hash[attr_name][:foreign_key]]= nil
            record.save
          end
        end
                
      end
      
    end
   
  end
    
end

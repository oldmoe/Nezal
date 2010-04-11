module DataStore
    
  module Relation
      
    module HasOne
      
      def self.included(base)
        base.extend ClassMethods
      end  
      
      def _relations
        @_relations ||= {}
      end 
      
      def _relations=(hash) 
        @_relations = hash
      end
       
      def save_has_one_relations
        self.class.single_associations_hash.each_pair do | key, value |
          attribute = send(key)
          attribute.save if (attribute && attribute.dirty?)
          _relations[self.class.single_associations_hash[key][:field_name]] = attribute && attribute[:id]
        end
      end
       
      module ClassMethods
      
        # Declarator#has_one declares a one-to-one relation attribute. 
        # The first parameter is the name of the attribute.
        # The second, if present, represts the configurations of the parameter 
        # The configurations currently supported:
        #   :class_name : specify the attibute class. If not present, the class is derived from the attr_name 
        #                 using Declarator#to_class_name
        #   :as : specify the attribute name in the attribute class to be automatically set to self once the attribute
        #         is assocaited with the model.
        #         If not set, the :as is drived attribute class is searched for a has_one/has_many attribute with the name of 
        #         the class name and type of the class.
        #         Example should do better here:
        #           class Blog 
        #             :has_one :writer, :as => :blog_entries
        #           end
        #           class Writer
        #             :has_many :blog_entries 
        #           end
        #           blog = Blog.new
        #           blog.writer = writer
        #         Now here, blog is to be automatically added to writer.blog_entries
        #         If :as config is not present, writer would be searched for a has_one attr named :blog or has_many 
        #         attr named :blogs, if found & of type Blog, it is updated to associate the blog to it accordingly
        def has_one( attr_name, configs = {} )
          single_associations_hash[attr_name] = configs
          single_associations_hash[attr_name][:class_name] ||=  to_class_name(attr_name)
          single_associations_hash[attr_name][:field_name] = to_field_name(attr_name)
          define_has_one_accessors(attr_name)
        end

        # Returns a Hash containing all the declared has_one attributes and their 
        # configurations to be used afterwards to save relation attrs  
        def single_associations_hash
          @_single_associations_hash ||= {}
        end

        def define_has_one_accessors(attr_name)
          module_eval %Q{ 
            def #{attr_name}()
              if @#{attr_name}.nil? && _relations[self.class.single_associations_hash[:#{attr_name}][:field_name]]
                klass = Kernel.const_get(self.class.single_associations_hash[:#{attr_name}][:class_name])
                @#{attr_name} = klass.get(_relations[self.class.single_associations_hash[:#{attr_name}][:field_name]])
              end
              @#{attr_name}
            end
          }
          module_eval %Q{ 
            def #{attr_name}=(attr_val)
              associated_attr = self.class.single_associations_hash[:#{attr_name}][:associated_attr] ||= self.class.has_one_associated_field_name(:#{attr_name})
              if attr_val.class.single_associations_hash.has_key? associated_attr
                attr_val.send("_"+associated_attr.to_s+"=", self) unless attr_val.send(associated_attr) ==  self
              elsif attr_val.class.many_associations_hash.has_key? associated_attr
                attr_val.send(associated_attr.to_s)._add self unless attr_val.send(associated_attr).include? self
              end
              @#{attr_name} = attr_val
            end
          }
          module_eval %Q{ 
            def _#{attr_name}=(attr_val)
              @#{attr_name} = attr_val
            end
          }
        end
                
        def has_one_associated_field_name(attr_name)
          hash = :single_associations_hash
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
        
        def to_field_name(name)
          single_associations_hash[name][:field_name] ||= "__" + name + "__id"
        end
        
        # Declarator#to_class_name Generates class name from a given attribute name
        def to_class_name(attr_name)
          ActiveSupport::Inflector.camelize(attr_name).to_sym
        end
        
      end
      
    end
   
  end
    
end

require 'active_support/inflector'

module DataStore

  module Relation
  
    CONFIGURATIONS = [:class_name]
  
    def self.included(base)
      base.send(:extend, DataStore::Relation::ClassMethods)
      base.send(:include, DataStore::Relation::OneToOne)
      base.send(:include, DataStore::Relation::OneToMany)
      base.send(:include, DataStore::Relation::ManyToOne)
#      base.send(:include, DataStore::Relation::ManyToMany)
    end  

    def _save_relations
      record = self.class.get(attributes[:id]) if attributes[:id]
      _save_one_to_one(record)    
      _save_one_to_many(record)    
    end
    
    def _delete_relations()
      _delete_one_to_one
      _delete_one_to_many
    end
    
    module ClassMethods
    
      # Relation#to_class_name Generates class name from a given attribute name
      def to_class_name(attr_name)
        ActiveSupport::Inflector.camelize(ActiveSupport::Inflector.singularize(attr_name)).to_sym
      end
      
      def to_class(hash, attr_name)
        hash[attr_name][:class] ||= Kernel.const_get(hash[attr_name][:class_name])
      end    
      
      def _delete_relations(id)
        record = get(id)
        record._delete_relations if record
      end
      
      def attach_notifier(type, operation, attr_name, klass)
        case type 
        when :one_to_one
          _one_to_one_notifiers[operation][attr_name] = klass
        when :one_to_many
          _one_to_many_notifiers[operation][attr_name] = klass
        when :many_to_one
          _many_to_one_notifiers[operation][attr_name] = klass
        when :many_to_many
          _many_to_many_notifiers[operation][attr_name] = klass
        else
#          This should actually raise some sort of exception
        end        
      end
      
      def _one_to_one_notifiers 
        @_one_to_one_notifier ||= { :on_update => {}, :on_delete => {} }
      end
      
      def _one_to_many_notifiers
        @_one_to_many_notifier ||= { :on_update => {}, :on_delete => {} }
      end

      def _many_to_one_notifiers
        @_many_to_one_notifier ||= { :on_update => {}, :on_delete => {} }
      end

      def _many_to_many_notifiers
        @_many_to_many_notifier ||= { :on_update => {}, :on_delete => {} }
      end
      
    end
    
  end
   
end

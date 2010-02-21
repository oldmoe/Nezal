require 'active_support/inflector'

module DataStore

  module Relation
    
    def save_relations
      relations = {}
      self.class.single_associations_hash.each_pair do | key, value |
        attribute = send(key)
        attribute.save unless (attribute.nil? || attribute.saved?)
        relations[key] = attribute && attribute[:id]
      end
      self.class.many_associations_hash.each_pair do | key, value |
        attr_list = self.send(key)
        attr_list.each do |attribute| 
          attribute.save unless (attribute.nil? || attribute.saved?)
          self.class.save_relation(key, attributes[:id], attribute[:id]) if attribute
        end
      end      
      relations
    end
    
  end

  
  # This module provides the necessary methods for declaration of a relation
  # The persistance of a many-to-one relation in a separate table
  module RelationCRUD

    CONFIGURATIONS = [:class_name]
    
    # RelationCRUD#has_one declares a one-to-one relation attribute. The first parameter is the name of the attribute.
    # The second papameter, if present, represts the configurations of the parameter 
    # The configurations currently support the following keys :
    #       :class_name : specify the attibute class. If not present, the class is derived by converting the attr_name 
    #                     using ActiveSupport::Inflector.camelize method
    def has_one( attr_name, configs = {} )
      single_associations_hash[attr_name] = configs
      single_associations_hash[attr_name][:class_name] ||=  to_class_name(name)
      attr_accessor name
    end

    # RelationCRUD#has_many declares a one-to-many relation attribute. The first parameter is the name of the attribute.
    # The second papameter, if present, represts the configurations of the parameter 
    # The configurations currently support the following keys :
    #       :class_name : specify the attibute class. If not present, the class is derived as specified in the RelationCRUD#to_class_name
    #       :table_name : specify the table name at which the records for the one_to_many relation record to be stored
    #                     If not present, the table name is generated from combining the class_name & the attribute class_name
    #                     as specified in the RelationCRUD#to_table_name
    def has_many( attr_name, configs = {} )
      many_assocaitions_hash[name] = configs
      many_assocaitions_hash[name][:class_name] ||=  to_class_name(name)
      attr_accessor(name)
    end
    
    # Returns a Hash containing all the declared has_one attributes and their configurations to be used afterwards to save relation attrs  
    def single_associations_hash
      @_single_associations_hash ||= {}
    end

    # Returns a Hash containing all the declared has_many attributes and their configurations to be used afterwards to save relation attrs    
    def many_associations_hash
      @_many_associations_hash ||= {}
    end

    # RelationCRUD#to_class_name Generates class name from a given attribute name
    def to_class_name(attr_name)
      ActiveSupport::Inflector.camelize(name)
    end

    # RelationCRUD#to_table_name Returns the table name to save ona_to_many relation record. Generate it, if not specifed by configs[:table_name]  
    def to_table_name(attr_name)
      many_associations_hash[name][:table_name] ||= self.name + "_" + name
    end


    def to_field_name(name)
      single_associations_hash[name][:field] ||= "__" + name + "__id"
    end
    
    # RelationCRUD#save_relation Store the has_many attr be adding a record to each attr in the list to a table specified by RelationCRUD#to_table_name
    # The first attribute is the attr_name to save instance of. Second attribute id : the main object, defining the has_many attr, id, attr_id : the id
    # of the object in the has_many attr list to be saved
    def save_relation(attr_name, id, attr_id)
      relation_db_handle(attr_name).put(nil, id, attr_id, 0)
    end
    
    def delete_relation(id)
      db_handle.del(nil, id, 0)
    end
      
    def relation_db_handle(name)
      @rel_db_handles ||= {}
      @rel_db_handles[name] ||= Database::open(many_associations_hash[name][:table_name])
    end
    
  end

end

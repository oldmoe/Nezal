require 'bdb'
require 'yaml'

module Bdb

  class Database
    
    DEFAULT_CONFIG = "config/bdb.yml"    
    
    ENV_FLAGS =  Bdb::DB_CREATE | # Create the environment if it does not already exist.
        Bdb::DB_INIT_TXN  | # Initialize transactions
        Bdb::DB_INIT_MPOOL| # Initialize the in-memory cache.
        Bdb::DB_INIT_LOCK   # Initialize locking.
    
    def self.initialize
      config_file = Dir.pwd + ::File::SEPARATOR + DEFAULT_CONFIG
      @@config = YAML.load_file(config_file)  #rescue nil || {}
      @@env = Bdb::Env.new(0)

      @@env.open(@@config["store_path"] + "/" + @@config["env_name"], ENV_FLAGS, 0);
      @@dbs = {}
      Kernel.at_exit do
        @@dbs.each_value { |value| value.close(0) }
        @@env.close 
      end
    end
    
    def self.open(name)
      @@dbs[name] ||= @@env.db.open(nil, name, nil, Bdb::Db::BTREE, Bdb::DB_CREATE, 0)
    end
    
  end
  
  module Persistable
  
    def self.included(base)
      db_handler = Database::open(base.name)
      base.class_variable_set(:@@db_handler, db_handler)
      seq_handler = Bdb::DbSequence.new(db_handler, base.name+"_seq", 0)        
      base.class_variable_set(:@@seq_handler, seq_handler)
      seq_handler.initial_val(1)
      seq_handler.open(nil, Bdb::DB_CREATE)
      base.extend(ClassMethods)
    end    

  end
  
  module ClassMethods
    
    def find(key)
      value = (record=@@db_handler.get(nil, key, nil, 0)).nil?  ? nil :  Marshal.load(record)
      options = { :key => key, :value => value}
    end
    
    def select()
    end
    
    def dump(object)
      Marshal.dump(object)
    end
    
    def restore(data)
      Marshal.restore(data)
    end
    
    def create(options = {})
      key = options[:key] || class_variable_get(:@@seq_handler).get(nil, 1, 0).to_s
      new_value = dump(options[:value]) 
      class_variable_get(:@@db_handler).put(nil, key, new_value, 0)
      options[:key] = key 
      options
    end
    
    def update(options = {})
    end
    
    def destroy(key)
      @@db_handler.del(nil, key, 0)
    end
    
    def generate_key
      return "#{(Time.now.to_f * 100000).to_i.to_s(36)}:#{Process.pid.to_s(36)}"
    end
    
    def list()
      values = []
      begin
        cursor = class_variable_get(:@@db_handler).cursor(nil, 0)
        result =  cursor.get(nil, nil, Bdb::DB_FIRST)
        while result
          value = restore(result[1])
          values << { :key => result[0], :value => value }
          result = cursor.get(nil, nil, Bdb::DB_NEXT)
        end
      rescue 
        #TODO There should be some error handling in here we will see
        cursor.close
      end
      cursor.close
      puts values
      values
    end
    
  end
  
end

Bdb::Database::initialize

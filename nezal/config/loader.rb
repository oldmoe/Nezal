require 'bdb'
require 'yaml'

module Bdb

  class Database
    
    SINGLE_FILE = 0
    MULTIPLE_FILES = 1
    NO_FILE = 2
    
    DEFAULT_CONFIG = "config/bdb.yml"    
    DEFAULT_ENVIRONMENT = "production"
    
    ENV_FLAGS =  Bdb::DB_CREATE | # Create the environment if it does not already exist.
        Bdb::DB_INIT_TXN  | # Initialize transactions
        Bdb::DB_INIT_MPOOL| # Initialize the in-memory cache.
        Bdb::DB_INIT_LOCK   # Initialize locking.
    
    def self.initialize
      env = (ENV["environment"] ||= DEFAULT_ENVIRONMENT)
      config_file = Dir.pwd + ::File::SEPARATOR + DEFAULT_CONFIG
      @@config = (YAML.load_file(config_file))[env]
      @@env = Bdb::Env.new(0)

      @@env.open(@@config["store_path"] + ::File::SEPARATOR + @@config["env_name"], ENV_FLAGS, 0);
      @@dbs = {}
      Kernel.at_exit {  ::Bdb::Database.close } 
    end
    
    def self.close
      @@dbs.each_value { |value| value.close(0) }
      @@env.close 
    end
    
    def self.open(name, mode = MULTIPLE_FILES )
      @@dbs[name] ||= @@env.db.open(nil, name, nil, Bdb::Db::BTREE, Bdb::DB_CREATE, 0)
    end
    
  end
  
  module Persistable
  
    def self.included(base)
      db_handler = Database::open(base.name)
      base.class_variable_set(:@@db_handler, db_handler)
      base.extend(ClassMethods)
      Bdb::DbSequence.new(db_handler, '123', 0)
    end    

  end
  
  module ClassMethods
  
    def sequence
      (@@sequence ||= ->(){
        seq = Bdb::DbSequence.new(class_variable_get(:@@db_handler), self.name + "_seq", 0)
        seq.initial_val(1)
        seq.open(nil, Bdb::DB_CREATE)
        seq
      }.call()).get(nil, 1, 0).to_s
    end
    
    def find(key)
      value = (record = class_variable_get(:@@db_handler).get(nil, key, nil, 0)).nil?  ? nil :  restore(record)
      options = { :key => key, :value => value }
    end
    
    def each
      cursor = @@db_handler.cursor(nil, 0)
      begin
        while result = cursor.get(nil, nil, Bdb::DB_NEXT)
          obj = restore(result[1])
          obj[:id] = result[0]
          yield obj
        end
      ensure
        cursor.close(0) if cursor
      end
    end
    
    def dump(object)
      Marshal.dump(object)
    end
    
    def restore(data)
      Marshal.load(data)
    end
    
    def create(options = {})
      key = options[:key] || sequence
      new_value = dump(options[:value]) 
      class_variable_get(:@@db_handler).put(nil, key, new_value, 0)
      find(key)
    end
    
    def update(options = {})
    end
    
    def destroy(key)
      class_variable_get(:@@db_handler).del(nil, key, 0)
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
      values
    end
    
  end
  
end

Bdb::Database::initialize

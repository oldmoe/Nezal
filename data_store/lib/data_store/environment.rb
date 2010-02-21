require 'bdb'
require 'yaml'

module DataStore
  
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
      @@env.flags_on= 1

      @@env.open(@@config["store_path"] + ::File::SEPARATOR + @@config["env_name"], ENV_FLAGS, 0);
      @@dbs = {}
      Kernel.at_exit {  ::DataStore::Database.close } 
    end
    
    def self.close
      @@dbs.each_value { |value| value.close(0) }
      @@env.close 
    end
    
    def self.open(name, mode = MULTIPLE_FILES )
      @@dbs[name] ||= @@env.db.open(nil, name, nil, Bdb::Db::BTREE, Bdb::DB_CREATE, 0)
    end

    
  end  
  
end

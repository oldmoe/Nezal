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
      seq_handler = Bdb::DbSequence.new(db_handler, base.name+"_seq", 0)        
      base.class_variable_set(:@@seq_handler, seq_handler)
      base.extend(Enumerable)
      base.extend(ClassMethods)
    end  
    
    def save
      puts "Inside SAVE #{self.class}"
      puts self.class.db_handle
      key = @attributes.delete(:id) || sequence
      persistant = self.class.persist(@attributes)
      puts self.class.dump(persistant)
      self.class.db_handle.put(nil, key, self.class.dump(persistant), 0)
      @attributes[:id] = key
      self
    end
    
    def destroy
      db_handle.del(nil, @attributes[:key], 0)
    end  
    
    module ClassMethods
    
      def query
        @query = { :id => nil, :dir => Bdb::DB_NEXT } 
      end
    
      def sequence
        (@sequence ||= ->(){
          seq = Bdb::DbSequence.new(db_handle, self.name + "_seq", 0)
          seq.initial_val(1)
          seq.open(nil, Bdb::DB_CREATE)
          seq
        }.call()).get(nil, 1, 0).to_s
      end
      
      def db_handle
#        puts "DB_handle :   #{self.name}"
        @db_handle ||= Database::open(self.name)
#        class_variable_get(:@@db_handler)
      end
      
      def generate_key
        return "#{(Time.now.to_f * 100000).to_i.to_s(36)}:#{Process.pid.to_s(36)}"
      end
      
      def dump(object)
        Marshal.dump(object)
      end
    
      def restore(data)
        Marshal.load(data)
      end
      
      def create(options = {})
        key = options.delete(:id) || sequence
        persistant = persist(options)
        db_handle.put(nil, key, dump(persistant), 0)
        options[:id] = key
        self.new(options)
      end
      
      def delete(key)
        db_handle.del(nil, key, 0)
      end
      
      def find(params={})
        values = []
        begin
          cursor = db_handle.cursor(nil, 0)
          result =  cursor.get(params[:id], nil, Bdb::DB_SET_RANGE)
          while result
            obj = restore(result[1])
            obj[:id] = result[0]
            values << self.new( obj )
            result = cursor.get(nil, nil, Bdb::DB_NEXT)
          end
        rescue Exception => e
          puts e.backtrace
          puts e
          #TODO There should be some error handling in here we will see
          cursor.close
        end
        cursor.close
        values
      end
      
      def index
      end 
      
      def get(id)
        result = db_handle.get(nil, id, nil, 0)
        obj = result ? self.new( restore(result).merge({:id => id}) ) : nil
      end
      
      # This should take a collection and return 2 arrays
      # one in the hash to be saved with in the object
      # the other is the objects that should persist in separate table
      def persist(hash)
        persistant = {}
        hash.each_pair do |key, value|
          if value.class.is_a? Persistable
            hash[key] = value.save
            persistant[key] = hash[key][:id]
          elsif value.is_a? Hash
            persistant[key] = persist(value)
          elsif value.is_a? Array && value.is_a? Persistable
            persistant[key] = []
            value.each_index do |index| 
              if value[index].is_a? Persistable 
                value[index] = value[index].save
                persistant[key][index] = value[index].attributes[:id]
              end
            end
          else
            persistant[key] = value
          end          
        end
        persistant
      end
      
      def each 
        begin
          cursor = db_handle.cursor(nil, 0)
          result =  cursor.get(query[:id], nil, Bdb::DB_SET_RANGE)
          while result
            obj = restore(result[1])
            obj[:id] = result[0]
            yield self.new( obj )
            result = cursor.get(nil, nil, query[:dir])
          end
        rescue Exception => e
          puts e.backtrace
          puts e
          #TODO There should be some error handling in here we will see
          cursor.close
        end
        cursor.close
      end
    
    end
    
  end

end

Bdb::Database::initialize

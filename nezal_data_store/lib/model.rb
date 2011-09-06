require 'qlzruby'

module DataStore

  class Model

    attr_accessor :data
    attr_reader :key   

    def initialize(key, data=nil, saved=false)
      @key = key
      @data = data
      @saved = saved
      init
    end

    def method_missing(method, *args)
      m = method.to_s
      if m.end_with?('=') && args.length == 1
        method_name = m.sub('=','')
        return @data[method_name] = args[0]
      else
        return @data[m]
      end
    end
    
    def driver
      @driver ||= self.class.driver
    end

    def store
      @store ||= self.class.store
    end

    def indexes
      self.class.indexes
    end

    def save
      driver.save(@key, self.class.serialize(@data))
      indexes.each_value do | index |
        index.save(self)
      end
      @saved = true
    end

    def destroy
      driver.delete(@key)
      indexes.each_value do | index |
        index.delete(self)
      end
      @saved = false
    end

    def saved?
      @saved
    end
    
    def next(index, count=1)
      index = index.to_s
      self.class.check_index_exists index
      result = indexes[index].after(self, count)
      convert_to_objects result
    end

    def previous(index, count=1)
      index = index.to_s
      self.class.check_index_exists index
      result = indexes[index].before(self, count)
      convert_to_objects result
    end

    def [] key
      @data[key.to_s]
    end

    def []= key, val
      @data[key.to_s] = val
    end

    def convert_to_objects(list)
      self.class.convert_to_objects(list)
    end 

    def init
      # implemented by child classes
    end

    private :driver, :store, :convert_to_objects, :init
    
    
    class << self

      def serialize(obj)
        QuickLZ.compress(::MessagePack.pack(obj))   
      end

      def deserialize(string)
        ::MessagePack.unpack(QuickLZ.decompress(string))
      end

      def get(key)
        result = driver.get(key)
        return self.new(result[0], deserialize(result[1]), true) if result
        nil
      end
      
      def [](key)
        get(key)
      end

      def create(key, value=nil)
        record = self.new(key, value)
        record.save
        record
      end

      def first(index, count=1)
        index = index.to_s
        check_index_exists index
        result = indexes[index].first(count)
        convert_to_objects result
      end

      def last(index, count=1)
        index = index.to_s
        check_index_exists index
        result = indexes[index].last(count)
        convert_to_objects result
      end

      def convert_to_objects(list)
        list.collect do |key|
          record = driver.get(key)
          self.new(record[0], self.deserialize(record[1]), true)
        end
      end 

      def driver
#        @driver ||= Driver::Redis::DB.new(store)
#        @driver ||= Driver::Bdb::DB.new(store)
        @driver ||= Driver::SQLite::DB.new(store)
      end

      def store
        @store ||= self.name.gsub(/([a-z])([A-Z])/, '\1_\2').downcase
      end
      
      def index(index_name, options)
        index_name = index_name.to_s
        indexes[index_name] = Index.new(store, index_name, options)
      end
      
      def indexes
        @indexes ||= {}
      end

      def check_index_exists index_name
        if indexes[index_name].nil?
          raise StandardError.new "Index '#{index_name}' does not exist"
        end
      end 

    end

  end

end

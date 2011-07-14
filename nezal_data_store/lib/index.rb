module DataStore 

  class Index

    attr_accessor :method

    def initialize(db_name, index_name, options)
      @options = options
      @method = options[:method]
      @db_name = db_name
      @index_name = index_name
    end    

    def save(object)
      driver.save(object.send(method), object.key)
    end

    def delete(object)
      driver.delete(object.key)
    end

    def before(object, count=1)
      driver.before(object.send(method), object.key, count)
    end
  
    def after(object, count=1)
      driver.after(object.send(method), object.key, count)
    end

    def driver
      #@driver ||= Driver::Bdb::Index.new(@db_name, @index_name)
      #@driver ||= Driver::Redis::Index.new(@db_name, @index_name)
      @driver ||= Driver::SQLite::Index.new(@db_name, @index_name)
    end

  end

end

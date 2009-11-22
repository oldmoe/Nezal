require 'bdb'

module DB
  
  include Bdb
  
  def self.included(base)
    base.extend(ClassMethods)
    base.init
  end
  
  def key
    @key
  end
  
  def value
    @value
  end
  
  def data
    @data
  end
  
  def data=(new_data)
    @data = new_data
  end
  
  def [](k)
    @data[k]
  end
  
  def []=(k, v)
    @data[k] = v
  end
  
  def save
    value = self.class.dump(data)
  end
  
  def reload
  end
  
  def destroy
    self.class.destory(key)
  end
  
  def update
  end
  
  module ClassMethods
    
    @@env = Env.new(0)
    @@env.open()
    
    Kernel.at_exit {
      
    }
    
    def find(key)
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
      key = options[:key] || "#{(Time.now.to_f * 100000).to_i.to_s(36)}:#{Process.pid.to_s(36)}"
      new_value = self.dump(options[:value]) 
    end
    
    def destroy(key)
    end
    
    def init
      @db = @@env.db
      @db.open()
    end
  
  end
  
end

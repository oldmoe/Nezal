module DataStore

  class StorableList < Array
    attr_accessor :name
    
    def initialize(name)
      @name = name
    end
        
  end
  
  class RelationIdentifier
    
    attr_accessor :id
    attr_accessor :class_name  
  
    def initialize(id, class_name, list = false)
      @id = id
      @class_name = class_name
      @list = list
    end
    
    def list?
      @list
    end
    
  end
  
  module SequenceKey
  
    def self.included(base)
      base.extend(Sequence)
    end
  
    module Sequence
      def generate
        (@sequence ||= ->(){
          seq = Bdb::DbSequence.new(db_handle, db_name + "_seq", 0)
          seq.initial_val(1)
          seq.open(nil, Bdb::DB_CREATE)
          seq
        }.call()).get(nil, 1, 0).to_s
      end
    end
    
  end

  module RealtimeKey
  
    def self.included(base)
      base.extend(Realtime)
    end    
    
    module Realtime
      def generate
        return "#{(Time.now.to_f * 100000).to_i.to_s(36)}:#{Process.pid.to_s(36)}"
      end
    end

  end
  
end

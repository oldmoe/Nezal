class User < DataStore::Model


  class << self

    SEP = '-'.freeze

    def generate_key(*args)
      args.join(SEP)
    end    
  
  end
  
end

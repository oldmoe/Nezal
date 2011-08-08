class FriendRequest < DataStore::Model

  SEP = '-'.freeze 

  @@data = { "receivers" =>[] }

  index :sender, :method => :sender

  def timestamp
    key.split(self.class::SEP).first
  end

  def sender
    key.split(self.class::SEP).last
  end

  class << self

    def generate_key(*args)
      args.join(SEP)
    end    
  
  end


end

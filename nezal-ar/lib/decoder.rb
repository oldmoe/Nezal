module Nezal

  module Decoder

    def self.encode(data)
       Yajl.dump(data)
    end
    
    def self.decode(data)
      Yajl.load(data)
    end
    
  end

end

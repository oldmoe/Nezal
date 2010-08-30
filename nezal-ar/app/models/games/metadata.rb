class Metadata
  
  def self.edit(game, data)
    game.metadata = data 
    game.save
  end  
    
  def self.load(game)
    game.metadata
  end
  
  def self.edit_campaign(camp, data)
    camp.metadata = data
    camp.save
  end
  
  def self.load_campaign(camp)
    camp.metadata    
  end
  
  def self.encode(data)
     Yajl.dump(data)
  end
  
  def self.decode(data)
    Yajl.load(data)
  end
end

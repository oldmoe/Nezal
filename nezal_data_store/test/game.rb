require './data_store'

class Game < DataStore::Model
  
end


if __FILE__ == $0  
  game = Game.new(1, {'time'=> Time.now.to_s})
  game.save
  g = Game.get(1)
  p g
end


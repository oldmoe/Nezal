class Mission

  class << self
  
    def init
      game = Game::current
      save = false
      if game.missions.nil?
        game.missions = {}
        save = true
      end
      if game.missions['id_generator'].nil?
        game.missions['id_generator'] = 1
        save = true
      end
      if game.missions['list'].nil?
        game.missions['list'] = {}
        save = true
      end
      if save
        game.save
      end    
    end

    def all
      init
      game = Game::current
      missions = game.missions['list']
    end

    def get id 
      id = id.to_i
      game = Game::current
      game.missions['list'][id]
    end

    def edit id, data
      id = id.to_i
      init
      game = Game::current
      game.missions['list'][id] = data
      game.save
    end

    def delete id
      id = id.to_i
      init
      game = Game::current
      deleted_mission = game.missions['list'][id]
      if deleted_mission
        missions = game.missions['list'].select do | key, mission |
          mission['next'] == id
        end
        missions.each do | key, mission |
          mission['next'] = deleted_mission['next']
        end
        game.missions['list'].delete(id)
        game.save
      end
    end

    def add name, parent
      parent = parent.to_i
      init
      game = Game::current
      mission = { 'name' => name, 'data' => {} }
      mission['id'] = game.missions['id_generator']
      next_mission = 0 
      unless game.missions['list'][parent].nil? 
        next_mission = game.missions['list'][parent]['next']
        game.missions['list'][parent]['next'] = mission['id']
      end
      mission['next'] = next_mission
      game.missions['id_generator'] += 1
      game.missions['list'][mission['id']]= mission
      game.save
    end

  end  

end

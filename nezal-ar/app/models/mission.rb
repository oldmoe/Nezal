class Mission

  class << self  
  
    def init
      game = Game::current
      game.missions ||= {}
      game.missions['id_generator'] ||= 1
      game.missions['list'] ||= {}
      game.save
    end

    def all
      game = Game::current
      missions = game.missions['list']
    end

    def get id 
      game = Game::current
      game.missions['list'][id]
    end

    def edit id, data
      init
      game = Game::current
      game.missions['list'][id] = data
      game.save
    end

    def delete id
      init
      id = id.to_i
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
      init
      game = Game::current
      parent = parent.to_i
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

class Game < DataStore::Model

  @@data = { "buildings" => {}, "workers" => {}, "weapons" => {}, "creeps" => {}, "ranks" => [], "researches" => {}, "ranks" => {} }
  @@speed_factor = 1

  def init
    if @data
      @@data.clone.each_pair do |k, v|
        @data[k] = v.clone unless @data[k]
      end
    else
      @data = @@data.clone
    end
    buildings.each_pair do |building_name, building_data|
      building_levels = self.buildings[building_name]['levels']
      building_levels.keys.each do |level|
        building_levels[level]['time'] /= @@speed_factor
        building_levels[level]['unit_per_worker_minute'] *= @@speed_factor if building_levels[level]['unit_per_worker_minute']
      end
    end
  end

  def path
    FB_CONFIGS::find('name', name)['game_name']       
  end

  class << self  

    def current
      @game = get(GAME_NAME)
    end

  end

end

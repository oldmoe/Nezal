class Game < DataStore::Model

  @@data = { "modes" => {}, "ranks" => {}, "products" => { "fb" => {} }, "missions" => {} }

  def init
    if @data
      @@data.clone.each_pair do |k, v|
        @data[k] = v.clone unless @data[k]
      end
    else
      @data = @@data.clone
    end
  end

  def path
    FB_CONFIGS::find('name', name)['game_name']       
  end

  def process_service_request user_key, request_data
    
  end

  def user_data user_profile
    data = {}
    data = @data.each_pair do |k, v|
            data[k] = v
          end
    data['missions'] = {}
    data['missions'][user_profile.current_mission] = Mission.get(user_profile.current_mission)
    data
  end

  class << self  

    def current
      @game = get(GAME_NAME)
    end

  end

end

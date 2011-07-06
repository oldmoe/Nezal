class BaseDefenderController < GamesController

  post '/:game_name/neighbor/building/collect' do
    data = Metadata.decode(params['data'])
    @neighbor_profile = UserGameProfile.where('game_id'=>game.id, 'user_id'=> data['user_id']).first
    klass = get_helper_klass()
    result = klass.collect_neighbor_building(user_game_profile, @neighbor_profile, data)
    return Metadata.encode(result)
  end

  get '/:game_name/global_map' do
    result = BD::GlobalMap.new(user_game_profile, Metadata.decode(params['data'])).generate
    return Metadata.encode(result)
  end
  
  post '/:game_name/generate_creep' do
    data = Metadata.decode(params['data']) 
    klass = get_helper_klass()
    result = klass.generate_creep user_game_profile, data
    return Metadata.encode(result)
  end
  
  post '/:game_name/cancel_creep_generation' do
    data = Metadata.decode(params['data']) 
    klass = get_helper_klass()
    result = klass.cancel_creep_generation user_game_profile, data
    return Metadata.encode(result)
  end
  

end

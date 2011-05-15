class BaseDefenderController < GamesController

  post '/:game_name/neighbor/building/collect' do
    data = Metadata.decode(params['data'])
    @neighbor_profile = UserGameProfile.where('game_id'=>@game.id, 'user_id'=> data['user_id']).first
    klass = get_helper_klass()
    result = klass.collect_neighbor_building(@game_profile, @neighbor_profile, data)
    return Metadata.encode(result)
  end


end

class GamesController < ApplicationController
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'

  # get the game object metadata
  get '/:game_name/data' do
    data = {
      :game_data => { :data => Game::current.user_data(user_game_profile) } , 
      :user_data => { :coins => user.coins,
                      :data => user_game_profile.data
                    },
      :missions_data => { :data => UserMissions.all(user_game_profile) },
      :current_mission => { :data => UserMissions.current(user_game_profile) }
    }
    data[:user_data][:volatile_data] = user_game_profile['volatile_data'] || {}
    encode(data)
  end
  
  # update the user game profile
  post '/:game_name/data' do
    BaseDefender.edit_game_profile(user_game_profile, params['data'])
    user_game_profile.quests['descriptions'] = BD::Quest::load_quests(user_game_profile)
    data = {
      :user_data => { :coins => user_game_profile.user.coins, 
                      :rank => user_game_profile.rank,
                      :exp => user_game_profile.exp, 
                      :locale => user_game_profile.locale, 
                      :metadata => user_game_profile.data
                      }
    }
    encode(data)
  end

  get '/:game_name/global_scores' do
    result = user_game_profile.global_scores(decode(params['data'])['game_mode'], 5)
    encode(result)
  end

  get '/:game_name/friends' do
    result = user_game_profile.friends(decode(params['data'])['friends_ids'])
    encode(result)
  end
  
  get '/:game_name/mission' do
    data = decode(params['data'])
    result = UserMissions.data(user_game_profile, data['id'])
    encode(result)
  end

  # Change User to be nolonger a newbie
  post '/:game_name/users/newbie' do
    if @game_profile.newbie
      @game_profile.newbie = false;
      @game_profile.save
    end
    encode( {:user_data => {'exp' => @game_profile.exp, 'rank' => @game_profile.rank.name} })    
  end
  
  # User bookmarked the application
  post '/:game_name/users/bookmark' do
    if(!@game_profile.bookmarked)
      # Here should go the code to reward the bookmark action
    end
    encode( {:user_data => {'coins' => @game_profile.user.coins}} )
  end
  
  # User likes the application
  post '/:game_name/users/like' do
    if(!@game_profile.like)
      # Here should go the code to reward the like action
    end
    encode( {:user_data => {'coins' => @game_profile.user.coins}} )
  end
  
  # User subscribed to the application
  post '/:game_name/users/subscribe' do
    if(!@game_profile.subscribed)
      # Here should go the code to reward the subscribe action
    end
    encode( {:user_data => {'coins' => @game_profile.user.coins}} )
  end

  # Change User Locale
  post '/:game_name/users/locale' do
    @game_profile.locale = params['locale'];
    @game_profile.save
    @game_profile.locale
  end

  post '/:game_name/credits' do
    LOGGER.debug ">>>>>>>>>>>> Facebook credits"
    LOGGER.debug ">>>>>>>>  #{params}"
    result = nil
    data = Service::PROVIDERS[service_provider][:helper]::decode params['signed_request'], app_configs if params['signed_request']
    if data
      case params['method']
      when 'payments_get_items'
        result = {'content' => [], 'method' => 'payments_get_items' }
        product = Product.get(data['order_info'])
        product['item_id'] = data['order_info']
        result['content'] << product
      when 'payments_status_update'
        result = {'content' => {}, 'method' => 'payments_status_update' }
        if params['status'] == 'placed'
          result['content']['status'] = 'settled'
          result['content']['order_id'] = data['order_id']
        end
      end
    end
    encode(result)
  end

  get '/:game_name/requests/exclude' do
    ids = []
    user_requests = Request.get(user_game_profile.key)    
    ids = user_requests.excluded_friends unless user_requests.nil?
    encode(ids)
  end

  post '/:game_name/requests' do
    user_requests = Request.get(user_game_profile.key)
    if user_requests.nil?
      user_requests = Request.create(user_game_profile.key)
    end
    data = decode(params['data'])
    data['requests'].each do |id, request|
      user_requests.requests[id] = request
    end
    user_requests.save
  end

  post '/:game_name/requests/accept' do 
    data = decode(params['data'])
    request_id = data['request_id']
    from_user_key = data['from']
    user_requests = Request.get(build_game_profile_key(from_user_key))
    request = user_requests.process user_game_profile.service_id, request_id
  end

  get '/:game_name/' do
    File.read(File.join( 'public', @app_configs["game_name"], @service_provider + '-' + 'index.html'))
  end

  post '/:game_name/' do
    File.read(File.join( 'public', @app_configs["game_name"], @service_provider + '-' + 'index.html'))
  end

  post '/:game_name/users/reset' do
    user_game_profile.destroy
    user.destroy
  end


end

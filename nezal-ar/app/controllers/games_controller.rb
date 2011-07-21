class GamesController < ApplicationController
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'

  # get the game object metadata
  get '/:game_name/data' do
    data = {
      :game_data => { :metadata => Game::current.data } , 
      :user_data => { :coins => user.coins, 
                      :rank => user_game_profile.rank,
                      :exp => user_game_profile.exp,
                      :locale => user_game_profile.locale, 
                      :metadata => user_game_profile.data
                    },
      :ranks => Game::current.ranks
    }
    data[:user_data][:volatile_data] = user_game_profile['volatile_data'] || {}
    JSON.generate(data)
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
    JSON.generate(data)
  end

  get '/:game_name/neighbor/:id' do
    neighbor_user_profile = BD::Neighbor.neighbor_empire(user_game_profile, params[:id])
    result = {
              :user_data => { 
                :rank => neighbor_user_profile.rank,
                :exp => neighbor_user_profile.exp, 
                :newbie => neighbor_user_profile.newbie,
                :locale => neighbor_user_profile.locale, 
                :metadata => neighbor_user_profile.data
              }
            }
    JSON.generate(result)
  end

  get '/:game_name/friends' do
    result = user_game_profile.friends(Metadata.decode(params['data'])['friends_ids'])
    JSON.generate(result)
  end

  post '/:game_name/generate_creep' do
    data = Metadata.decode(params['data']) 
    result = BaseDefender.generate_creep user_game_profile, data
    return Metadata.encode(result)
  end
  
  post '/:game_name/cancel_creep_generation' do
    data = Metadata.decode(params['data']) 
    result = BaseDefender.cancel_creep_generation user_game_profile, data
    return Metadata.encode(result)
  end

  post '/:game_name/neighbor/building/collect' do
    data = Metadata.decode(params['data'])
    neighbor_user_profile = BaseDefender.collect_neighbor_building(user_game_profile, data)
    result = {
              :user_data => { 
                :rank => neighbor_user_profile.rank,
                :exp => neighbor_user_profile.exp, 
                :newbie => neighbor_user_profile.newbie,
                :locale => neighbor_user_profile.locale, 
                :metadata => neighbor_user_profile.data
              }
            }
    Metadata.encode(result)
  end

  get '/:game_name/global_map' do
    result = BD::GlobalMap.new(user_game_profile, Metadata.decode(params['data'])).generate
    return Metadata.encode(result)
  end
  
  # Change User to be nolonger a newbie
  post '/:game_name/users/newbie' do
    if @game_profile.newbie
      @game_profile.newbie = false;
      klass = get_helper_klass()
      klass.newbie_no_more(@game_profile)
      @game_profile.save
    end
    JSON.generate( {:user_data => {'exp' => @game_profile.exp, 'rank' => @game_profile.rank.name} })    
  end
  
  post '/:game_name/users/coins' do
   # @user.coins += params['coins'].to_i;
   # @user.save
   # JSON.generate( {:user_data => {'coins' => @user.coins}})
  end
  
  # User bookmarked the application
  post '/:game_name/users/bookmark' do
    if(!@game_profile.bookmarked)
      klass = get_helper_klass()
      klass.bookmark(@game_profile)
    end
    JSON.generate( {:user_data => {'coins' => @game_profile.user.coins}} )
  end
  
  # User likes the application
  post '/:game_name/users/like' do
    if(!@game_profile.like)
      klass = get_helper_klass()
      klass.like(@game_profile)
    end
    JSON.generate( {:user_data => {'coins' => @game_profile.user.coins}} )
  end
  
  # User subscribed to the application
  post '/:game_name/users/subscribe' do
    if(!@game_profile.subscribed)
      klass = get_helper_klass()
      klass.subscribe(@game_profile)
    end
    JSON.generate( {:user_data => {'coins' => @game_profile.user.coins}} )
  end

  # Change User Locale
  post '/:game_name/users/locale' do
    @game_profile.locale = params['locale'];
    @game_profile.save
    @game_profile.locale
  end
  
  # Do not remove 127.0.0.1 from the valid gateway, it is safe 
  @@valid_gateways = ['195.58.177.2','195.58.177.3','195.58.177.4','195.58.177.5', "127.0.0.1"]
  
  @@packages = {"0.8" => 2500, "1.6" => 6000, "2.4" => 10000}
  
  
  get '/:game_name/daopay/confirmation' do
    redirect payment_fault_redirection unless @@valid_gateways.include? request.ip
    @package_coins = @@packages[params["price"]]
    @user.coins += @@packages[params["price"]]
    @user.save
  payment = Payment.create!({:profile_id=>@game_profile.id,:price=>params['price']})
    erb :"#{@app_configs["game_name"]}/daopay_confirmation"
  end

  get '/:game_name/' do
    File.read(File.join( 'public', @app_configs["game_name"], @service_provider + '-' + 'index.html'))
  end

  post '/:game_name/payment_issues' do
    Message.create!({:body => params["body"], "type" => 'payment_issue', :profile_id => @game_profile.id})
  end

  post '/:game_name/users/reset' do
    user_game_profile.destroy
    user.destroy
  end

  protected
  
  def payment_fault_redirection
    "/fb-games/#{@app_configs["game_name"]}/"
  end

end

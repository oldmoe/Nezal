class GamesController < ApplicationController
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
    
  get '/:game_name/challenges' do
    camps = Campaign.find_all_by_game_id(@game.id)
    JSON.generate(camps)
  end

  # get the game object metadata
  get '/:game_name/metadata' do 
    klass = get_helper_klass()
    game_metadata = klass.load_game(@game)
    user_metadata = klass.load_game_profile(@game_profile)
    ranks = {}
    @game.ranks.each { |rank| ranks[rank.name] = [rank.lower_exp, rank.upper_exp]}
    data = {
      :game_data => { :metadata => game_metadata,
                      :current_campaign => @game.current_campaign.path} , 
      :user_data => { :coins => @user.coins, 
                      :rank => @game_profile.rank.name,
                      :exp => @game_profile.exp, 
                      :newbie => @game_profile.newbie,
                      :locale => @game_profile.locale, 
                      :bookmarked => @game_profile.bookmarked,
                      :like => @game_profile.like,
                      :metadata => user_metadata, 
                    },
      :ranks => ranks
    }
    JSON.generate(data)
  end
  
  # get the game object metadata
  post '/:game_name/metadata' do 
    klass = get_helper_klass()
    user_metadata = klass.edit_game_profile(@game_profile, params['data'])
    user_metadata = klass.load_game_profile(@game_profile)
    data = {
      :user_data => { :coins => @game_profile.user.coins, 
                      :rank => @game_profile.rank.name,
                      :exp => @game_profile.exp, 
                      :newbie => @game_profile.newbie,
                      :locale => @game_profile.locale, 
                      :bookmarked => @game_profile.bookmarked,
                      :like => @game_profile.like,
                      :metadata => user_metadata
                      }
    }
    JSON.generate(data)
  end
  
  # get the game object metadata
  get '/:game_name/:camp_path/metadata' do 
    klass = get_helper_klass()
    camp = Campaign.where(:game_id => @game.id, :path => params['camp_path']).first
    camp_metadata = klass.load_campaign(camp)
    user_camp = UserCampaign.where( 'fb_user' => @user.fb_id, 'campaign_id'=> camp.id).first
    if !user_camp
      user_camp = UserCampaign.new(:profile_id => @game_profile.id, 'campaign_id'=> camp.id, 'fb_user' => @user.fb_id)
      klass.init_user_campaign(user_camp)
    end
    user_camp_metadata = klass.load_user_campaign(user_camp)
    data = {
      :camp_data => { :metadata => camp_metadata} , 
      :user_data => { :metadata => user_camp_metadata }
    }	
    JSON.generate(data)
  end
    
  # get the game object metadata
  post '/:game_name/:camp_path/metadata' do 
    klass = get_helper_klass()
    camp = Campaign.where(:game_id => @game.id, :path => params['camp_path']).first
    user_camp = UserCampaign.where( 'fb_user' => @user.fb_id, 'campaign_id'=> camp.id ).first
    klass.edit_user_campaign(user_camp, params['data'])
    user_camp_metadata = klass.load_user_campaign(user_camp)
    data = {
      :user_data => { 
                      :metadata => user_camp_metadata,
                      :rank => user_camp.profile.rank.name,
                      :exp => user_camp.profile.exp,
                      :coins => user_camp.profile.user.coins
                   }
    }
    JSON.generate(data)
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
    @user.coins += params['coins'].to_i;
    @user.save
    JSON.generate( {:user_data => {'coins' => @user.coins}})
  end
  
  # User bookmarked the application
  post '/:game_name/users/bookmark' do
    if(!@game_profile.bookmarked)
      klass = get_helper_klass()
      klass.bookmark(@game_profile)
    end
    JSON.generate( {:user_data => {'coins' => @game_profile.user.coins}} )
  end
  
  # User bookmarked the application
  post '/:game_name/users/like' do
    if(!@game_profile.like)
      klass = get_helper_klass()
      klass.like(@game_profile)
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
    
    erb :"#{@app_configs["game_name"]}/daopay_confirmation"
  end
    
  get '/:game_name' do 
    File.read(File.join( 'public', @app_configs["game_name"], 'index.html'))
  end
  
  protected
  
  def payment_fault_redirection
    "/fb-games/#{@app_configs["game_name"]}/"
  end

  post '/:game_name/:camp_name/:userid/friendsranks' do 
		response = {:top => []}
		camp = Campaign.where(:game_id => @game.id, :path => params['camp_name']).first
		result = @user.ranking camp.id,params['friends']
		response[:close] = result[:previous].collect{|uc| {:id => uc[:fb_user], :score => uc[:score] } } + [{:id => result[:user_camp][:fb_user], :score => result[:user_camp][:score], :rank => result[:rank]}]+ result[:next].collect{|uc| {:id => uc[:fb_user], :score => uc[:score] } }
		top_scorers = FbUser.top_scorers camp.id,params['friends']
		top_scorers.each_with_index do |item,index|
			response[:top].push( {'id'=> top_scorers[index]['fb_user'],'score'=> top_scorers[index]['score']})			
		end
		return  JSON.generate(response)
  end 

	post '/:game_name/:camp_name/:userid/worldranks' do 
		response = {:top => []}
		camp = Campaign.where(:game_id => @game.id, :path => params['camp_name']).first
		result = @user.ranking camp.id
		response[:close] = result[:previous].collect{|uc| {:id => uc[:fb_user], :score => uc[:score] } } + [{:id => result[:user_camp][:fb_user], :score => result[:user_camp][:score], :rank => result[:rank]}]+ result[:next].collect{|uc| {:id => uc[:fb_user], :score => uc[:score] } }
		top_scorers = FbUser.top_scorers camp.id
		top_scorers.each_with_index do |item,index|
			response[:top].push( {'id'=> top_scorers[index]['fb_user'],'score'=> top_scorers[index]['score']})			
		end
	  JSON.generate(response)
	end

  post '/:game_name/payment_issues' do
    Message.create!( { :body => params["body"], "type" => 'payment_issue', :profile_id => @game_profile.id } )
  end
 end

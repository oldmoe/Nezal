class GamesController < ApplicationController
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
    
  get '/:game_name/challenges' do
    game = Game.find_by_name(@app_configs["name"])
    camps = Campaign.find_all_by_game_id(game.id)
    JSON.generate(camps)
  end

  # get the game object metadata
  get '/:game_name/metadata' do 
    klass = get_helper_klass()
    game_metadata = klass.load(@game)
    user_metadata = klass.load_game_profile(@game_profile)
    ranks = {}
    @game.ranks.each { |rank| ranks[rank.name] = [rank.lower_exp, rank.upper_exp]}
    data = {
      :game_data => { :metadata => game_metadata} , 
      :user_data => { :coins => @user.coins, 
                      :rank => @game_profile.rank.name,
                      :exp => @game_profile.score, 
                      :newbie => @game_profile.newbie,
                      :locale => @game_profile.locale, 
                      :metadata => user_metadata
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
    @user = FbUser.where(:fb_id => @user.fb_id).first
    data = {
      :user_data => { :coins => @user.coins, 
                      :rank => @game_profile.rank.name,
                      :exp => @game_profile.score, 
                      :newbie => @game_profile.newbie,
                      :locale => @game_profile.locale, 
                      :metadata => user_metadata
                      }
    }
    JSON.generate(data)
  end
  
  # get the game object metadata
  get '/:game_name/:camp_path/metadata' do 
    klass = get_helper_klass()
    camp = Campaign.where(:path => params['camp_path'], :game_id => @game.id).first
    camp_metadata = klass.load_campaign(camp)
    user_camp = UserCampaign.where('campaign_id'=> camp.id, 'fb_user' => @user.fb_id).first
    if !user_camp 
      @user.game_profiles.where(:game_id => camp.game.id).first
      user_camp = UserCampaign.new(:profile_id => @game_profile.id, 'campaign_id'=> camp.id, 'fb_user' => @user.fb_id)
      klass.init_user_campaign(user_camp)
      user_camp.save
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
    camp = Campaign.where(:path => params['camp_path'], :game_id => @game.id).first
    user_camp = UserCampaign.where('campaign_id'=> camp.id, 'fb_user' => @user.fb_id).first
    klass.edit_user_campaign(user_camp, params['data'])
    user_camp = UserCampaign.where('campaign_id'=> camp.id, 'fb_user' => @user.fb_id).first
    data = {
      :user_data => { :metadata => user_camp.profile.metadata,
                      :rank => user_camp.profile.rank.name,
                      :exp => user_camp.profile.score
                   }
    }
    JSON.generate(data)
  end
  
  # Change User to be nolonger a newbie
  post '/:game_name/users/newbie' do
    @game_profile.newbie = false;
    @game_profile.save
  end
    
  get '/:game_name' do 
    File.read(File.join( 'public', @app_configs["game_name"], 'index.html'))
  end

	
  post '/:game_name/:camp_name/:userid/friendsranks' do 
		response = {:top => []}
		camp = Campaign.where(:path => params['camp_name'], :game_id => @game.id).first
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
		camp = Campaign.where(:path => params['camp_name'], :game_id => @game.id).first
		result = @user.ranking camp.id
		response[:close] = result[:previous].collect{|uc| {:id => uc[:fb_user], :score => uc[:score] } } + [{:id => result[:user_camp][:fb_user], :score => result[:user_camp][:score], :rank => result[:rank]}]+ result[:next].collect{|uc| {:id => uc[:fb_user], :score => uc[:score] } }
		top_scorers = FbUser.top_scorers camp.id
		top_scorers.each_with_index do |item,index|
			response[:top].push( {'id'=> top_scorers[index]['fb_user'],'score'=> top_scorers[index]['score']})			
		end
	  JSON.generate(response)
  end 
end

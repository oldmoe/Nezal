class GamesController < ApplicationController
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
    
  get '/:game_name/challenges' do
    game = Game.find_by_name(@app_configs["name"])
    camps = Campaign.find_all_by_game_id(game.id)
    JSON.generate(camps)
  end

  get '/:game_name/friends' do 
    puts ` db_stat -c -h ~/BerkeleyStore/Nezal/`
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
    if(params['type'] == 'game_profile')
      user_metadata = klass.edit_game_profile(@game_profile, params['data'])
    end
    user_metadata = klass.load_game_profile(@game_profile)
    # Reload The user after the changes
    game_metadata = klass.load(@game)
    @user = FbUser.where(:fb_id => @user.fb_id).first
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
  
  # Change User to be nolonger a newbie
  post '/:game_name/newbie' do
    @game_profile.newbie = false;
    @game_profile.save
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
    camp_metadata = klass.load_campaign(camp)
    user_camp = UserCampaign.where('campaign_id'=> camp.id, 'fb_user' => @user.fb_id).first
    klass.edit_user_campaign(user_camp, params['data'])
    user_camp = UserCampaign.where('campaign_id'=> camp.id, 'fb_user' => @user.fb_id).first
    data = {
      :rank => user_camp.profile.rank.name,
      :exp => user_camp.profile.score
    }
    JSON.generate(data)
  end
  
  get '/:game_name/:campaign_id' do
    
  end
    
  get '/:game_name' do 
    File.read(File.join( 'public', @app_configs["game_name"], 'index.html'))
  end
    
end

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
					  :subscribed => @game_profile.subscribed,
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
  
  @@packages = {"1" => 4000, "3" => 15000, "5" => 22000}
  
  def self.coin_packages
    @@packages
  end
  
  
  
  #@@onecard = {:trans_key => "ejrTryKn", :keyword => "ahGszYmF", :merchant_id => "Nezal@onecard.com"} #Staging Credentials
  @@onecard = {:trans_key => "M7YGeyen", :keyword => "GXR5xaME", :merchant_id => "Nezal@onecard.com"} #Production Credentials
  def self.onecard
    @@onecard
  end
  
  require 'digest/md5'
  get '/:game_name/onecard' do
    timein = Time.now.utc.to_i
    to_sign = params["merchantID"] + timein.to_s + params["amount"] + params["currency"] + timein.to_s
    
    Payment.create('trans_id' => timein, 'trans_done' => false, 'profile_id' => @user.fb_id, 'price' => params["amount"] )
    
    {:timein => timein, :hashKey => Digest::MD5.hexdigest(to_sign + @@onecard[:trans_key])}.to_json
  end
  
  post '/:game_name/onecard_response' do
    if params["OneCard_Code"] == "18" || params["OneCard_Code"] == "00"
      to_sign = @@onecard[:merchant_id] + params["OneCard_TransID"] + params["OneCard_Amount"] + params["OneCard_Currency"] +
                params["OneCard_RTime"] + @@onecard[:keyword] + params["OneCard_Code"]
      digest = Digest::MD5.hexdigest(to_sign)
      
      if params["OneCard_RHashKey"] == digest
        payment = Payment.where( 'trans_id' => params["OneCard_TransID"] ).first
        payment.trans_done = true
        user = FbUser.where( 'fb_id' => payment.profile_id ).first
        
        user.coins += @@packages[ params["OneCard_Amount"] ];
        user.save
        payment.save
      end
    end
    redirect payment_redirection
  end
  
  get '/:game_name' do 
    File.read(File.join( 'public', @app_configs["game_name"], 'index.html'))
  end

  # Get the required campaign / mission info
  # also load the replay data
  # package them all as json and send over the wire  
  get '/:game_name/replays/:id' do     
    replay = Replay.where(:id => params[:id]).first
    klass = get_helper_klass()
    data = {
        :replay => replay.replay,
        :level => replay.level,
        :mission_name => replay.mission_name,
        :user_metadata => replay.profile.metadata,
        :game_metadata => klass.load_game(@game),
        :campaign_metadata => Campaign.where(:path => replay.camp_name).first.metadata,
        :camp_name => replay.camp_name
    }
    data.to_json
  end


  protected
  
  def payment_redirection
    "/fb-games/#{@app_configs["name"]}/"
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

  post '/:game_name/replay' do
     replay = Replay.create!({:profile_id=>@game_profile.id,:game_id=>@game.id,:level=>params['level'],:replay=>params['replay'],:score=>params['score'], :camp_name=>params['camp_name'],:mission_name=>params['mission_name']})
  end
 end

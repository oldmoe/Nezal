require 'cgi'
require 'json'

class ApplicationController < Sinatra::Base

  enable :sessions

  before do 
    app_name = env['PATH_INFO'].split('/')[1]
    if app_name
      @app_configs = FB_CONFIGS::find('name', app_name)
    	if @app_configs && get_fb_session
    	  begin
	        @game = Game.where( 'name' =>app_name).first
			@user = FbUser.where( 'fb_id' => @fb_uid ).first
			if(!@user)
				@user = FbUser.create('fb_id' => @fb_uid, 'coins' => get_helper_klass::DEFAULT_USER_COINS )
			end
			@game_profile = UserGameProfile.where('game_id' => @game.id, 'user_id' => @user.id).first
			if !(@game_profile)
				LOGGER.debug "Game profile not found, creating one"
				@game_profile = UserGameProfile.new()
				@game_profile.game= @game
				@game_profile.user= @user
				get_helper_klass.init_game_profile(@game_profile)
        register_user_to_games_pipe params['Trackingcode'], @user.id if(!params['Trackingcode'].nil?)
				@game_profile.save!()
				LOGGER.debug params["inviter"]
				if(params["inviter"])
					get_helper_klass.reward_invitation(params["inviter"])
				end
			end
		  rescue Exception => e
          LOGGER.debug e
          ''
		  end
	    else
          LOGGER.debug "No Cookie Or Params Found"
	    end
    end
  end
  
  after do
  	if params[:uid] || params[:fb_sig_user]
	  	headers 'Cache-Control' => "no-cache", 'Pragma' => "no-cache", 'Expires' => "0"
	  end
  end
  
  protected
    
  def get_fb_session
	if env['rack.request.cookie_hash'] && 
	        (fb_cookie = env['rack.request.cookie_hash']["fbs_#{@app_configs['id']}"] ||
           env['rack.request.cookie_hash']["fbs_#{@app_configs['key']}"]) # if
		cookie = CGI::parse(fb_cookie)
		@fb_uid = cookie['uid'][0].split('"')[0]
		@fb_session_key = cookie['session_key'][0]
		LOGGER.debug ">>>>>> Cookie - uid : #{@fb_uid}"
		LOGGER.debug ">>>>>> Cookie - session_key : #{@fb_session_key}"
		true
	elsif params[:fb_sig_session_key] && params[:fb_sig_user] #&& params['fb_sig_added'] == "1"
		@fb_uid = params[:fb_sig_user] 
		@fb_session_key = params[:fb_sig_session_key]
		LOGGER.debug ">>>>>> Params - uid : #{@fb_uid}"
		LOGGER.debug ">>>>>> Params - session_key : #{@fb_session_key}"
		true
	elsif params[:session_key] && params[:uid] #&& params['fb_sig_added'] == "1"
		@fb_uid = params[:uid] 
		@fb_session_key = params[:session_key]
		LOGGER.debug ">>>>>> Our Params - uid : #{@fb_uid}"
		LOGGER.debug ">>>>>> Our Params - session_key : #{@fb_session_key}"
		true
	else
		false
	end
  end
  
  def get_helper_klass
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].gsub("-", "_"))
    Kernel.const_get(helper)
  end
  
  def register_user_to_games_pipe tracking_code, user_id
    developer_id = 468
    game_id      = 36121
    api_key      = 'w00f76vmwzeyy#pr'
    test_mode    = true
    games_pipe = Gamespipe::new( developer_id, game_id, api_key, test_mode) 
    games_pipe.report_registration(tracking_code, user_id)
  end
  
end

require 'cgi'
require 'json'

class ApplicationController < Sinatra::Base

  set :raise_errors, false
  set :show_exceptions, false
  
  enable :sessions

  before do 
    app_name = env['PATH_INFO'].split('/')[1]
    @service_provider = env['SCRIPT_NAME'].split('/')[1].split('-')[0]
    LOGGER.debug "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    LOGGER.debug env['PATH_INFO']
    LOGGER.debug "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    if app_name
      @app_configs = FB_CONFIGS::find('name', app_name)
      @app_configs ||= K_CONFIGS::find('name', app_name)
    	if @app_configs && get_provider_session
    	  begin
	        @game = Game.where( 'name'=>app_name ).first
			    @user = User.where( 'service_type'=>Service::PROVIDERS[@service_provider], 'service_id'=>@service_id ).first
			    if(!@user)
				    @user = User.create( 'service_type'=>Service::PROVIDERS[@service_provider], 'service_id'=>@service_id )
			    end
			    @game_profile = UserGameProfile.where('game_id'=>@game.id, 'user_id'=>@user.id).first
			    if !(@game_profile)
				    LOGGER.debug "Game profile not found, creating one"
				    @game_profile = UserGameProfile.new()
				    @game_profile.game= @game
				    @game_profile.user= @user
				    get_helper_klass.init_game_profile(@game_profile)
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
    
  def get_provider_session
    if Service::PROVIDERS[@service_provider] == Service::KONGREGATE
      LOGGER.debug ">>>>>> Kongregate - We will check for session in params"
      if params[:kongregate_user_id] && params[:kongregate_game_auth_token]
        @service_id = params[:kongregate_user_id]
	      @session_key = params[:kongregate_game_auth_token]        
	      LOGGER.debug ">>>>>> Params - service_id : #{@service_id}"
	      LOGGER.debug ">>>>>> Params - session_key : #{@session_key}"
      elsif params[:session_key] && params[:uid]
	      @service_id = params[:uid] 
	      @session_key = params[:session_key]
	      LOGGER.debug ">>>>>> Our Params - service_id : #{@service_id}"
	      LOGGER.debug ">>>>>> Our Params - session_key : #{@session_key}"
	      true
      else
	      false
      end
    elsif Service::PROVIDERS[@service_provider] == Service::FACEBOOK
      if env['rack.request.cookie_hash'] && 
              (fb_cookie = env['rack.request.cookie_hash']["fbs_#{@app_configs['id']}"] ||
               env['rack.request.cookie_hash']["fbs_#{@app_configs['key']}"]) # if
	      cookie = CGI::parse(fb_cookie)
	      @service_id = cookie['uid'][0].split('"')[0]
	      @session_key = cookie['session_key'][0]
	      LOGGER.debug ">>>>>> Cookie - service_id : #{@service_id}"
	      LOGGER.debug ">>>>>> Cookie - session_key : #{@session_key}"
	      true
      elsif params[:fb_sig_session_key] && params[:fb_sig_user]
	      @service_id = params[:fb_sig_user] 
	      @session_key = params[:fb_sig_session_key]
	      LOGGER.debug ">>>>>> Params - service_id : #{@service_id}"
	      LOGGER.debug ">>>>>> Params - session_key : #{@session_key}"
	      true
      elsif params[:session_key] && params[:uid]
	      @service_id = params[:uid] 
	      @session_key = params[:session_key]
	      LOGGER.debug ">>>>>> Our Params - service_id : #{@service_id}"
	      LOGGER.debug ">>>>>> Our Params - session_key : #{@session_key}"
	      true
      else
	      false
      end
    else
      false
    end
  end
    
  def get_helper_klass
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    Kernel.const_get(helper)
  end
  
end

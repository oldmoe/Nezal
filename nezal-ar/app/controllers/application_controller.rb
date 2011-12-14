require 'cgi'
require 'json'

class ApplicationController < Sinatra::Base

  enable :sessions
  
  def app_configs
    @app_configs
  end

  before do 
    app_name = env['PATH_INFO'].split('/')[1]
    @service_provider = env['SCRIPT_NAME'].split('/')[1].split('-')[0]
    if app_name
      @app_configs = FB_CONFIGS::find('name', app_name)
    	if @app_configs && get_provider_session
    	  begin
	        @game = Game.where( 'name' =>app_name).first
	        key = FbUser::generate_key(Service::PROVIDERS[@service_provider][:prefix], @service_id)
    			@user = FbUser.where( 'fb_id' => key ).first
    			if(!@user)
    				@user = FbUser.create('fb_id' => key, 'coins' => get_helper_klass::DEFAULT_USER_COINS )
    			end
    			@game_profile = UserGameProfile.where('game_id' => @game.id, 'user_id' => @user.id).first
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
    if Service::PROVIDERS[@service_provider] && Service::PROVIDERS[@service_provider][:prefix] == Service::KONGREGATE
      if params[:kongregate_user_id] && params[:kongregate_game_auth_token]
        @service_id = params[:kongregate_user_id]
        @session_key = params[:kongregate_game_auth_token]        
      elsif params[:session_key] && params[:uid]
        @service_id = params[:uid] 
        @session_key = params[:session_key]
        true
      else
        false
      end
    elsif Service::PROVIDERS[@service_provider] && Service::PROVIDERS[@service_provider][:prefix] == Service::FACEBOOK
      @service_id = Service::PROVIDERS[@service_provider][:helper].authenticate params, env['rack.request.cookie_hash'], app_configs
      if @service_id
        true
      else
        false
      end
    end
  end
  
  def get_helper_klass
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].gsub("-", "_"))
    Kernel.const_get(helper)
  end
  
end

require 'cgi'
require 'json'

class ApplicationController < Sinatra::Base

  enable :sessions
  def app_configs
    @app_configs
  end
  def user_game_profile
    @game_profile
  end
  def game
    @game
  end
  def user
    @user
  end
  def app_name
    @app_name
  end
  def service_provider
    @service_provider
  end

  before do 
    app_name = env['PATH_INFO'].split('/')[1]
    @service_provider = env['SCRIPT_NAME'].split('/')[1].split('-')[0]
    if app_name
      @app_configs = FB_CONFIGS::find('name', app_name)
      @app_configs ||= K_CONFIGS::find('name', app_name)
      if @app_configs && get_provider_session
        begin
          @game = Game.get(app_name)
          key = User::generate_key(Service::PROVIDERS[@service_provider][:prefix], @service_id)
          @user = User.get(key)
          if(!@user)
            @user = User.create(key,  { 'coins'=> 1000 })
            puts "Creating new user !! #{@user}"
          end
          key = UserGameProfile::generate_key(Service::PROVIDERS[@service_provider][:prefix], Game::current.key, @service_id)
          @game_profile = UserGameProfile.get(key)
          if !(@game_profile)
            @game_profile = UserGameProfile.create(key)
            LOGGER.debug params["inviter"]
            if(params["inviter"])
              get_helper_klass.reward_invitation(params["inviter"])
            end
          end
        rescue Exception => e   
          LOGGER.debug e
          LOGGER.debug e.backtrace
          ''
        end
      else
        LOGGER.debug "No Cookie Or Params Found"
      end
    end
  end
  
  after do
    if !user_game_profile.nil? && user_game_profile.needs_saving?
      user_game_profile.save
    end
    if params[:uid] || params[:fb_sig_user]
      headers 'Cache-Control' => "no-cache", 'Pragma' => "no-cache", 'Expires' => "0"
    end
  end
  
  protected
    
  def get_provider_session
    if Service::PROVIDERS[@service_provider][:prefix] == Service::KONGREGATE
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
    elsif Service::PROVIDERS[@service_provider][:prefix] == Service::FACEBOOK
      @service_id = Service::PROVIDERS[@service_provider][:helper].authenticate params, env['rack.request.cookie_hash'], app_configs
      if @service_id
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

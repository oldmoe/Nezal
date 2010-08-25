require 'cgi'
require 'json'

class ApplicationController < Sinatra::Base

  enable :sessions 

  set :root,  File.dirname(File.dirname(File.dirname(__FILE__)))
  set :static, true

  before do 
    app_name = env['PATH_INFO'].split('/')[1]
    if app_name
      @app_configs = FB_CONFIGS::find('name', app_name)
      puts env['PATH_INFO'].split('/')[1]
    	if @app_configs && get_fb_session
	      retry_times = 1
    	  begin
          @user = FbUser.find_or_create_by_fb_id(@fb_uid)
          @user.session = @fb_session_key
          p @user
          @game = Game.find_by_name(app_name)
          game_profile = UserGameProfile.find_by_game_id_and_user_id(@game.id, @user.id)
         if !(game_profile)
            game_profile = UserGameProfile.new()
            game_profile.game = @game
            game_profile.user = @user
            get_helper_klass.init_game_profile(game_profile)
            game_profile.save()
            p game_profile
            p game_profile.metadata
          end
        rescue Exception => e
          p e
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
    puts env['rack.request.cookie_hash']
	  if env['rack.request.cookie_hash'] && 
	        (fb_cookie = env['rack.request.cookie_hash']["fbs_#{@app_configs['id']}"] ||
           env['rack.request.cookie_hash']["fbs_#{@app_configs['key']}"])
		  cookie = CGI::parse(fb_cookie)
      @fb_uid = cookie['uid'][0].split('"')[0]
      @fb_session_key = cookie['session_key'][0]
      LOGGER.debug ">>>>>> Cookie - uid : #{@fb_uid}"
      LOGGER.debug ">>>>>> Cookie - session_key : #{@fb_session_key}"
		  true
	  elsif params[:fb_sig_session_key] && params[:fb_sig_user]
      @fb_uid = params[:fb_sig_user] 
      @fb_session_key = params[:fb_sig_session_key]
      LOGGER.debug ">>>>>> Params - uid : #{@fb_uid}"
      LOGGER.debug ">>>>>> Params - session_key : #{@fb_session_key}"
		  true
	  elsif params[:session_key] && params[:uid]
      @fb_uid = params[:uid] 
      @fb_session_key = params[:session_key]
      LOGGER.debug ">>>>>> Our Params - uid : #{@fb_uid}"
      LOGGER.debug ">>>>>> Our Params - session_key : #{@fb_session_key}"
	  else
		  false
	  end
  end
  
  def get_helper_klass
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    Kernel.const_get(helper)
  end
  
end

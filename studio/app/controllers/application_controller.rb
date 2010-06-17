require 'cgi'
require 'json'
require 'lib/sequel_to_json'

class ApplicationController < Sinatra::Base

  enable :sessions 

  set :root,  File.dirname(File.dirname(File.dirname(__FILE__)))
  set :static, true

  before do 
=begin
    LOGGER.debug "BEGIN OF REQUEST"
    LOGGER.debug ">>>>>> Referer :     #{env['HTTP_REFERER']}"
    LOGGER.debug ">>>>>> Request Path : #{env['REQUEST_PATH']}"
    LOGGER.debug ">>>>>> Request Path : #{env['rack.request.path']}"
    LOGGER.debug ">>>>>> Query String : #{env["QUERY_STRING"]}"
    LOGGER.debug ">>>>>> Cookie : #{env['HTTP_COOKIE']}"
    LOGGER.debug ">>>>>> Rack Cookie : #{env['rack.request.cookie_hash']}"
=end
    @app_configs = FB_CONFIGS::find('name', env['SCRIPT_NAME'].split('/')[1])
	if @app_configs && get_fb_session
        @user = User[@app_configs['id'], @fb_uid] || User.create(:app_id => @app_configs['id'] , :user_id => @fb_uid, :global_score => 0, :first_round_score => 0, :round16_score => 0, :quarters_score => 0, :semis_score => 0, :finals_score => 0)
        @user.session = @fb_session_key
	else
      LOGGER.debug "No Cookie Or Params Found"
	end
=begin	
    if @app_configs && env['rack.request.cookie_hash'] && (fb_cookie = env['rack.request.cookie_hash']["fbs_#{@app_configs['id']}"] || env['rack.request.cookie_hash']["fbs_#{@app_configs['key']}"])
        @cookie = CGI::parse(fb_cookie)
        @fb_uid = @cookie['uid'][0].split('"')[0]
        @fb_session_key = @cookie['session_key'][0]
        LOGGER.debug ">>>>>> Cookie - uid : #{@fb_uid}"
        LOGGER.debug ">>>>>> Cookie - session_key : #{@fb_session_key}"
        @user = User[@app_configs['id'], @fb_uid] || User.create(:app_id => @app_configs['id'] , :user_id => @fb_uid, :global_score => 0, :first_round_score => 0, :round16_score => 0, :quarters_score => 0, :semis_score => 0, :finals_score => 0)
        @user.session = @fb_session_key
        p @user
        p @user.session
    else
      puts "No Cookie Found"
    end
=end
  end
  
  protected
    
  def get_fb_session
	if env['rack.request.cookie_hash'] && (fb_cookie = env['rack.request.cookie_hash']["fbs_#{@app_configs['id']}"] || env['rack.request.cookie_hash']["fbs_#{@app_configs['key']}"])
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
	else
		false
	end
  end
  
end

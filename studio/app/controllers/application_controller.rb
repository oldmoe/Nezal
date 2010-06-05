require 'cgi'

class ApplicationController < Sinatra::Base

  enable :sessions 

  set :root,  File.dirname(File.dirname(File.dirname(__FILE__)))
  set :static, true

  before do 

    LOGGER.debug ">>>>>> "
    LOGGER.debug "BEGIN OF REQUEST"
    LOGGER.debug ">>>>>> Referer :     #{env['HTTP_REFERER']}"

    LOGGER.debug ">>>>>> Request Path : #{env['REQUEST_PATH']}"
    LOGGER.debug ">>>>>> Query String : #{env["QUERY_STRING"]}"
    LOGGER.debug ">>>>>> Cookie : #{env['HTTP_COOKIE']}"
    
    @app_configs = FB_CONFIGS::find('name', env['REQUEST_PATH'].split("/")[1])
    if @app_configs && env['rack.request.cookie_hash'] && (fb_cookie = env['rack.request.cookie_hash']["fbs_#{@app_configs['id']}"])
        @cookie = CGI::parse(fb_cookie)
        @fb_uid = @cookie['uid'][0].split('"')[0]
        @fb_session_key = @cookie['session_key'][0]
        LOGGER.debug ">>>>>> Cookie - uid : #{@fb_uid}"
        LOGGER.debug ">>>>>> Cookie - session_key : #{@fb_session_key}"
        @user = User[@app_configs['id'], @fb_uid] || User.create(:app_id => @app_configs['id'] , :user_id => @fb_uid)
        @user.session = @fb_session_key
        p @user
        p @user.session
    else
      puts "No Cookie Found"
    end
    
=begin
      puts "Inside Else"
      halt erb 'facebook/add_app_intro'.to_sym, {:layout => false}
=end
  end
  
end

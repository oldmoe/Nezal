require 'cgi'
require 'json'
require 'lib/sequel_to_json'

class ApplicationController < Sinatra::Base

  enable :sessions 

  set :root,  File.dirname(File.dirname(File.dirname(__FILE__)))
  set :static, true

  before do 
    LOGGER.debug "BEGIN OF REQUEST"
    LOGGER.debug ">>>>>> Referer :     #{env['HTTP_REFERER']}"
    LOGGER.debug ">>>>>> Request Path : #{env['REQUEST_PATH']}"
    LOGGER.debug ">>>>>> Request Path : #{env['rack.request.path']}"
    LOGGER.debug ">>>>>> Query String : #{env["QUERY_STRING"]}"
    LOGGER.debug ">>>>>> Cookie : #{env['HTTP_COOKIE']}"
    LOGGER.debug ">>>>>> Rack Cookie : #{env['rack.request.cookie_hash']}"
    @app_configs = FB_CONFIGS::find('name', env['SCRIPT_NAME'].split('/')[1])
    if @app_configs && env['rack.request.cookie_hash'] && (fb_cookie = env['rack.request.cookie_hash']["fbs_#{@app_configs['id']}"] || env['rack.request.cookie_hash']["fbs_#{@app_configs['key']}"])
        @cookie = CGI::parse(fb_cookie)
        @fb_uid = @cookie['uid'][0].split('"')[0]
        @fb_session_key = @cookie['session_key'][0]
        LOGGER.debug ">>>>>> Cookie - uid : #{@fb_uid}"
        LOGGER.debug ">>>>>> Cookie - session_key : #{@fb_session_key}"
        @user = User[@app_configs['id'], @fb_uid] || User.create(:app_id => @app_configs['id'] , :user_id => @fb_uid)
        @user.session = @fb_session_key
        @user = User.filter(:app_id => '103040546410849',:user_id => '750199343').first()
        p @user
        p @user.session
    else
      @user = User.filter(:app_id => '103040546410849',:user_id => '750199343').first() 
      puts "No Cookie Found"
    end
  end
  
end

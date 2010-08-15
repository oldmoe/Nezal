require 'sinatra'
require 'require_all'
require_all 'app/models/'

class OldApplicationController < Sinatra::Base

  enable :sessions 

  set :root,  File.dirname(File.dirname(File.dirname(__FILE__)))
  set :static, true
  set :public, "#{root}/public"
  
  attr_accessor :user
  
  before do 
    
    LOGGER.debug ">>>>>> "
    LOGGER.debug "BEGIN OF REQUEST"
    LOGGER.debug ">>>>>> Referer :     #{env['HTTP_REFERER']}"
    uri_params = CGI::parse(env["REQUEST_URI"])
    LOGGER.debug ">>>>>> URI params : #{uri_params}"
    if env["HTTP_REFERER"] && env["HTTP_REFERER"].index("http://apps.facebook.com") == 0
      @app_id = uri_params["fb_sig_app_id"][0]
      if uri_params["fb_sig_added"] == ["0"] && uri_params["fb_sig_session_key"] == []
        LOGGER.debug ">>>>>> App not added redirecting"
        halt erb :index, {:layout => false}
      elsif uri_params["fb_sig_expires"] && uri_params["fb_sig_expires"][0] && uri_params["fb_sig_expires"][0] < Time.now.to_i.to_s
        LOGGER.debug ">>>>>> App session expired"
        halt  erb :refresh, {:layout => false}
      else
        LOGGER.debug ">>>>>> Cookie :  #{env['rack.request.cookie_hash']}"
        LOGGER.debug ">>>>>> Request Path :  #{env['REQUEST_PATH']}"   
        session[:fb_app_id] = uri_params["fb_sig_app_id"][0]
        session[:fb_user_id] = uri_params["fb_sig_user"][0]
        session[:fb_session_key] = uri_params["fb_sig_session_key"][0]
        session[:fb_session_expires] = uri_params["fb_sig_expires"][0]
        session[:fb_sig_ss] =  uri_params["fb_sig_ss"][0]
                
        if  env['rack.request.cookie_hash'] && session[:fb_app_id] &&
                    env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user"] &&
                    env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires"]  > session[:fb_session_expires]
          session[:fb_session_key] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_session_key"] 
          session[:fb_session_expires] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires"] 
        end
        
        LOGGER.debug ">>>>>> FB User Id :  #{session[:fb_user_id]}"
        LOGGER.debug ">>>>>> FB Session Key :  #{session[:fb_session_key]}"
        LOGGER.debug ">>>>>> FB Session Expire :  #{session[:fb_session_expires]}"
      end
    else
      File.read(File.join('public/html', 'index.html'))
    end      
      
  end
  
end




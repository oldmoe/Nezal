require 'cgi'

class InitController < ApplicationController 
  
  enable :sessions
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook'
    
  get '' do 
    if env["HTTP_REFERER"].index("http://apps.facebook.com") == 0
      uri_params = CGI::parse(env["REQUEST_URI"])
      @app_id = uri_params["fb_sig_app_id"][0]
      if uri_params["fb_sig_added"] == ["0"] && uri_params["fb_sig_session_key"] == []
        erb :index, {:layout => false}
      else
        session[:fb_app_id] = uri_params["fb_sig_app_id"][0]
        session[:fb_user_id] = uri_params["fb_sig_user"][0]
        session[:fb_session_key] = uri_params["fb_sig_session_key"][0]
        session[:fb_session_expires] = uri_params["fb_sig_expires"][0]
        session[:fb_sig_ss] =  uri_params["fb_sig_ss"][0]
        if env['rack.request.cookie_hash'] && env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user"] 
          response.set_cookie(FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user", session[:fb_user_id])
          response.set_cookie(FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_session_key", session[:fb_session_key])
          response.set_cookie(FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires" , session[:fb_session_expires])
          response.set_cookie(FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_ss" , session[:fb_sig_ss])
        end
        redirect "/fb-games/#{FBConfigs::CONFIG[@app_id]['game_name']}"
      end
    else
      File.read(File.join('public/html', 'index.html'))
    end      
  end
  
end

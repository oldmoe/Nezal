require 'cgi'

class InitController < ApplicationController 
  
  enable :sessions
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook'
    
  get '' do 
    if env["HTTP_REFERER"].index("http://apps.facebook.com") == 0
      uri_params = CGI::parse(env["REQUEST_URI"])
      p uri_params
      @app_id = uri_params["fb_sig_app_id"][0]
      if uri_params["fb_sig_added"] == ["0"] && uri_params["fb_sig_session_key"] == []
#        File.read(File.join('public/html/facebook', 'index.html'))
        erb :index, {:layout => false}
      else
        session[:fb_app_id] = uri_params["fb_sig_app_id"][0]
        session[:fb_session_key] = uri_params["fb_sig_session_key"][0]
        session[:fb_user_id] = uri_params["fb_sig_user"][0]
        redirect "/fb-games/#{FBConfigs::CONFIG[@app_id]['game_name']}"
      end
    else
      File.read(File.join('public/html', 'index.html'))
    end      
  end
  
end

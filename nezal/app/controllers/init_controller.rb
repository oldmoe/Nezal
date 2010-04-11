require 'cgi'

class InitController < ApplicationController 
  
  enable :sessions
    
  get '' do 
    if env["HTTP_REFERER"].index("http://apps.facebook.com") == 0
      uri_params = CGI::parse(env["REQUEST_URI"])
      if uri_params["fb_sig_added"] == ["0"] && uri_params["fb_sig_session_key"] == []
        File.read(File.join('public/html/facebook', 'index.html'))
      else
        session[:fb_session_key] = uri_params["fb_sig_session_key"][0]
        session[:fb_user_id] = uri_params["fb_sig_user"][0]
        redirect "/fb-games/city-defender"
      end
    else
      File.read(File.join('public/html', 'index.html'))
    end      
  end
  
end

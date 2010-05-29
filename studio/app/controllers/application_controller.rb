require 'cgi'

class ApplicationController < Sinatra::Base

  enable :sessions 

  set :root,  File.dirname(File.dirname(File.dirname(__FILE__)))
  set :static, true

  before do 

    LOGGER.debug ">>>>>> "
    LOGGER.debug "BEGIN OF REQUEST"
    LOGGER.debug ">>>>>> Referer :     #{env['HTTP_REFERER']}"

## This is my uri path ======    LOGGER.debug "Req Path : #{env['REQUEST_PATH']}"
## This is the FB params ======   LOGGER.debug "Query Str : #{env['QUERY_STRING']}"

    query_params = CGI::parse(env["QUERY_STRING"])
    LOGGER.debug ">>>>>> Request Path : #{env['REQUEST_PATH']}"
    LOGGER.debug ">>>>>> Query String : #{env["QUERY_STRING"]}"
    LOGGER.debug ">>>>>> Query Params : #{query_params}"
    LOGGER.debug ">>>>>> Cookie : #{env['HTTP_COOKIE']}"
    
    @app_configs = FB_CONFIGS::find('name', env['REQUEST_PATH'][1, env['REQUEST_PATH'].length-2 ])
    
=begin
    if  ( query_params["fb_sig_app_id"] && !(query_params["fb_sig_app_id"].empty?) ) || 
                   ( env['rack.request.cookie_hash'] &&
                      env['rack.request.cookie_hash'][@app_configs["key"] + "_user"] &&
                      env['rack.request.cookie_hash'][@app_configs["key"] + "_expires"] )
      @app_id = query_params["fb_sig_app_id"][0]
      if query_params["fb_sig_added"] == ["0"] && query_params["fb_sig_session_key"] == []
        LOGGER.debug ">>>>>> App not added redirecting"
        halt erb 'facebook/add_app_intro'.to_sym, {:layout => false}
      elsif query_params["fb_sig_expires"] && query_params["fb_sig_expires"][0] && query_params["fb_sig_expires"][0] < Time.now.to_i.to_s
        LOGGER.debug ">>>>>> App session expired"
        halt  erb :refresh, {:layout => false}
      else
        LOGGER.debug ">>>>>> Request Path :  #{env['REQUEST_PATH']}"   
        LOGGER.debug ">>>>>> Cookie :  #{env['rack.request.cookie_hash']}"
        session[:fb_app_id] = query_params["fb_sig_app_id"][0]
        session[:fb_user_id] = query_params["fb_sig_user"][0]
        session[:fb_session_key] = query_params["fb_sig_session_key"][0]
        session[:fb_session_expires] = query_params["fb_sig_expires"][0]
        session[:fb_sig_ss] =  query_params["fb_sig_ss"][0]
                
        if  env['rack.request.cookie_hash'] && session[:fb_app_id] &&
                    env['rack.request.cookie_hash'][FB_CONFIGS[session[:fb_app_id]]["key"] + "_user"] &&
                    env['rack.request.cookie_hash'][FB_CONFIGS[session[:fb_app_id]]["key"] + "_expires"]  > session[:fb_session_expires]
          session[:fb_session_key] = env['rack.request.cookie_hash'][FB_CONFIGS[session[:fb_app_id]]["key"] + "_session_key"] 
          session[:fb_session_expires] = env['rack.request.cookie_hash'][FB_CONFIGS[session[:fb_app_id]]["key"] + "_expires"] 
        end
        
        LOGGER.debug ">>>>>> FB User Id :  #{session[:fb_user_id]}"
        LOGGER.debug ">>>>>> FB Session Key :  #{session[:fb_session_key]}"
        LOGGER.debug ">>>>>> FB Session Expire :  #{session[:fb_session_expires]}"
      end
    else
      puts "Inside Else"
      halt erb 'facebook/add_app_intro'.to_sym, {:layout => false}
    end      
=end
  end
  
end

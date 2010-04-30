require 'sinatra'
require 'require_all'
require_all 'app/models/'

class ApplicationController < Sinatra::Base

  enable :sessions 

  set :root,  File.dirname(File.dirname(File.dirname(__FILE__)))
  set :static, true
  set :public, "#{root}/public"
  
  attr_accessor :user
  
  before do 
    puts ">>> "
    puts ">>>>>> Cookie :  #{env['rack.request.cookie_hash']}"
    puts ">>>>>> Request Path :  #{env['REQUEST_PATH']}"
        
    uri_params = CGI::parse(env["REQUEST_URI"])

    if uri_params["fb_sig_expires"] && uri_params["fb_sig_expires"][0] && uri_params["fb_sig_expires"][0] < Time.now.to_i.to_s
      redirect "/"
    end
    
    if uri_params["fb_sig_added"] == ["1"]
        session[:fb_app_id] = uri_params["fb_sig_app_id"][0]
        session[:fb_user_id] = uri_params["fb_sig_user"][0]
        session[:fb_session_key] = uri_params["fb_sig_session_key"][0]
        session[:fb_session_expires] = uri_params["fb_sig_expires"][0]
        session[:fb_sig_ss] =  uri_params["fb_sig_ss"][0]
        puts "...... FB User Id :  #{session[:fb_user_id]}"
        puts "...... FB Session Key :  #{session[:fb_session_key]}"
        puts "...... FB Session Expire :  #{session[:fb_session_expires]}"
    end
        
    if  env['rack.request.cookie_hash'] && session[:fb_app_id] && env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user"] &&
      env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires"]  > session[:fb_session_expires]
      session[:fb_user_id] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user"] 
      session[:fb_session_key] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_session_key"] 
      session[:fb_session_expires] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires"] 
      puts ">>>>>> FB User Id :  #{session[:fb_user_id]}"
      puts ">>>>>> FB Session Key :  #{session[:fb_session_key]}"
      puts ">>>>>> FB Session Expire :  #{session[:fb_session_expires]}"
    end
  end
  
end

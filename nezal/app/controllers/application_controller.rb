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
        
    if  env['rack.request.cookie_hash'] && session[:fb_app_id] && env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user"] &&
      env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires"]  > session[:fb_session_expires]
      session[:fb_user_id] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user"] 
      session[:fb_session_key] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_session_key"] 
      session[:fb_session_expires] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires"] 
      puts ">>>>>> FB User Id :  #{session[:fb_user_id]}"
      puts ">>>>>> FB Session Key :  #{session[:fb_session_key]}"
      puts ">>>>>> FB Session Expire :  #{session[:fb_session_expires]}"
    end

    if session[:fb_user_id]
      @user = FBUser.get(session[:fb_user_id])
    end  
  end
  
end

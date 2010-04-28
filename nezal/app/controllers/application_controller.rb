require 'sinatra'
require 'require_all'
require_all 'app/models/'

class ApplicationController < Sinatra::Base

  enable :sessions 

  set :root,  File.dirname(File.dirname(File.dirname(__FILE__)))
  set :static, true
  set :public, "#{root}/public"
  
  def init()
    if($users.nil?)
      puts "Instantiating Data"      
      $users = {}    
    end
  end
    
  attr_accessor :user
  
  before do 
    puts "!!!!!!!!!!!!!! Inside App"
    p env['rack.request.cookie_hash']
    p env['REQUEST_PATH']
    
    puts "/////"
    puts request.cookies[FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user"]
    puts "/////////////////////////////"
    
    if env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user"] &&
      env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires"]  > session[:fb_session_expires]
      session[:fb_user_id] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_user"] 
      session[:fb_session_key] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_session_key"] 
      session[:fb_session_expires] = env['rack.request.cookie_hash'][FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires"] 
      puts [session[:fb_user_id]]  
      puts [session[:fb_session_key]]  
      puts [session[:fb_session_expires]]  
    else 
      response.set_cookie(FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_session_key", session[:fb_session_key])
      response.set_cookie(FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_expires" , session[:fb_session_expires])
      response.set_cookie(FBConfigs::CONFIG[session[:fb_app_id]]["key"] + "_ss" , session[:fb_sig_ss])
    end
    puts "!!!!!!!!!!!!!!!!!!!!!!!!!"
    init
    if session[:user_id] && ( @user = $users[session[:user_id]] )
      puts "====Application Controller: User Found : #{user}"
    elsif session[:fb_user_id]
      puts "====Application Controller: FB Session Exists"
      @user = FBUser.get(session[:fb_user_id])
    else
      puts "====Application Controller: Session Doesnt Exist"
    end  
  end
  
end

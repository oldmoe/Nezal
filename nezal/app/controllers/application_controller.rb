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
    init
    if session[:user_id] && ( @user = $users[session[:user_id]] )
      puts "====Application Controller: User Found : #{user}"
    elsif session[:fb_user_id]
      puts "====Application Controller: FB Session Exists"
      @user = User.get(session[:fb_user_id])
      @user = User.create( {:id => session[:fb_user_id]} ) unless @user
      p @user
    else
      puts "====Application Controller: Session Doesnt Exist"
      @user = User.create({})
      $users[@user[:id]] = @user
      session[:user_id] = @user[:id]
      puts "====Application Controller: User created : #{user.inspect}"
    end  
  end
  
end

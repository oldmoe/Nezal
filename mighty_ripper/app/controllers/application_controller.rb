require 'sinatra'
require 'require_all'
require_all 'app/models/'

class ApplicationController < Sinatra::Base

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
    puts params
    puts session
    
    if session[:user_id] && ! ( @user = $users[session[:user_id]] ).nil? 
      puts "====Application Controller: User Found : #{user}"
    else
      puts "====Application Controller: Session Doesnt Exist"
      @user = User.create
      $users[@user[:id]] = @user
      session[:user_id] = @user[:id]
      puts "====Application Controller: User created : #{user.inspect}"
    end  
  end
  
end

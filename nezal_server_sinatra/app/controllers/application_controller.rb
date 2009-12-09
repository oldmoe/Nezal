# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers

# There should be some initialization for the environment. Not quite sure to put it
# Perhaps a separate file for the database initialization  
require 'bdb'
require 'yaml'
require 'sinatra'
require 'sinatra/async'
require 'require_all'
require_all 'app/models/'

if($load.nil?)
  $load = "test"
  $config = YAML.load_file(Dir.pwd + "/config/bdb.yml")  #rescue nil || {}
  $dbs = { :rooms => nil, :room_users => nil, :events => nil }
  $env = Bdb::Env.new(0)
  $env_flags =  Bdb::DB_CREATE | # Create the environment if it does not already exist.
    Bdb::DB_INIT_TXN  | # Initialize transactions
    Bdb::DB_INIT_MPOOL| # Initialize the in-memory cache.
    Bdb::DB_INIT_LOCK   # Initialize locking.
  $env.open($config["store_path"] + "/" + $config["env_name"], $env_flags, 0);
  $dbs[:rooms] = $env.db
  $dbs[:rooms].open(nil, self.class.name, nil, Bdb::Db::BTREE, Bdb::DB_CREATE, 0)
  $dbs[:room_users] = $env.db
  $dbs[:room_users].open(nil, 'Room_User', nil, Bdb::Db::BTREE, Bdb::DB_CREATE , 0)
  $dbs[:events] = $env.db
  $dbs[:events].open(nil, 'Events', nil, Bdb::Db::BTREE, Bdb::DB_CREATE, 0)
  Kernel.at_exit {
    $dbs.each_value do |value|
      value.close(0)
    end
    $env.close 
  }
end

class ApplicationController < Sinatra::Base

  enable :sessions
  
  set :root,  File.dirname(File.dirname(File.dirname(__FILE__)))
  set :static, true
  set :public, "#{root}/public"
  
  attr_accessor :user

  if($data.nil?)
    puts "Instantiating Data"      
    $data = { :users => {} }    
  end

  before do 
    puts params
    if session[:user_id] && ! ( @user = $data[:users][session[:user_id]] ).nil? 
      puts "====Application Controller: User Found : #{user}"
    else
      puts "====Application Controller: Session Doesnt Exist"
      @user = User.create
      $data[:users][@user[:id]] = @user
      session[:user_id] = @user[:id]
      puts "====Application Controller: User created : #{user.inspect}"
    end  
  end
  
end

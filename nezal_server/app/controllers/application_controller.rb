# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers

# There should be some initialization for the environment. Not quite sure to put it
# Perhaps a separate file for the database initialization  
require 'bdb'
require 'yaml'

if($load.nil?)
  $load = "test"
  $config = YAML.load_file(Dir.pwd + "/config/bdb.yml")  #rescue nil || {}
  $dbs = { :rooms => nil, :room_users => nil, :events => nil }
  $env = Bdb::Env.new(0)
  $env_flags =  Bdb::DB_CREATE | # Create the environment if it does not already exist.
    Bdb::DB_INIT_TXN  | # Initialize transactions
    Bdb::DB_INIT_MPOOL| # Initialize the in-memory cache.
    Bdb::DB_INIT_LOCK   # Initialize locking.
  $env.open(File.join($config["store_path"], $config["env_name"]), $env_flags, 0);
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

class ApplicationController < ActionController::Base
  #session :on
  helper :all # include all helpers, all the time
#  protect_from_forgery # See ActionController::RequestForgeryProtection for details
  
  attr_accessor :user

  if($data.nil?)
    puts "Instantiating Data"      
    $data = { :users => {} }    
  end

  before_filter { |c|
    c.request.session_options[:id]
    if c.session[:user_id] && ! ( c.user = $data[:users][c.session[:user_id]] ).nil? 
      puts "====Application Controller: User Found : #{c.user}"
    else
      puts "====Application Controller: Session Doesnt Exist"
      c.user = User.create
      $data[:users][c.user[:id]] = c.user
      c.session[:user_id] = c.user[:id]
      puts "====Application Controller: User created : #{c.user.inspect}"
    end  
  }
  
  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  
end

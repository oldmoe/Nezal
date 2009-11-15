# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  session :on
  helper :all # include all helpers, all the time
#  protect_from_forgery # See ActionController::RequestForgeryProtection for details
  
  attr_accessor :user

  if($data.nil?)
    puts "Instantiating Data"      
    $data = { :rooms => {}, :users => {} }    
  end

  before_filter { |c|
    c.request.session_options[:id]
    if c.session[:user_id] && ! (c.user = $data[:users][c.session[:user_id]] ).nil? 
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

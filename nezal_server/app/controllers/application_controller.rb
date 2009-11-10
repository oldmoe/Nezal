# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  before_filter do
    if session[:user_id]
      @user = $data[:users][session[:user_id]] 
    else
      @user = User.create
      session[:user_id] = @user[:id]
    end
  end

  def user 
    @user 
  end

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  
  $data = { :rooms => {} , :users => {} }
  
end

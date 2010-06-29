require 'json'

class UsersController < ApplicationController 

  enable :sessions
  
  get '/count' do 
    { "users" => DB[:users].filter(:app_id => @app_configs["id"]).count() }.to_json
  end
  
  post '/remove' do
    user = User[params['fb_sig_app_id'], params['fb_sig_user']]
    user.delete() if ( user && params['fb_sig_uninstall'] )
    ''
  end

  post '/add' do
    
  end
  
end

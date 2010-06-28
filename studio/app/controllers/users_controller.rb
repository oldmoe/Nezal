require 'json'

class UsersController < ApplicationController 

  enable :sessions
  
  get '/count' do 
    { "users" => DB[:users].filter(:app_id => @app_configs["id"]).count() }.to_json
  end

end

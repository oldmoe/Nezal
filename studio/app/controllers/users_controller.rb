require 'json'

class UsersController < ApplicationController 

  enable :sessions
  
  get '/count' do 
    { :users  =>  User.dataset.count() }.to_json
  end

end

require 'json'

class UsersController < ApplicationController 

  enable :sessions
  
  get '/count' do 
    { "users" => DB[:users].filter(:app_id => @app_configs["id"]).count() }.to_json
  end
  
  get '/user' do 
    if @user
      {:user => @user}.to_json
    else
      {}.to_json
    end
  end
  
  post '/remove' do
    user = User[params['fb_sig_app_id'], params['fb_sig_user']]
    if ( user && params['fb_sig_uninstall'] )
      user.predictions_dataset.destroy
      user.comments_dataset.destroy
      user.delete() 
    end
    ''
  end

  post '/add' do
    if ( params['fb_sig_authorize'] )
      user = User[@app_configs['id'], @fb_uid]
      if !user 
        User.find_or_create( {:app_id => @app_configs['id'], :user_id => params['fb_sig_user'], 
                              :global_score => 0, :first_round_score => 0,
                              :round16_score => 0, :quarters_score => 0, :semis_score => 0, :finals_score => 0 } )
      end
    end
    ''
  end
  
end

class FBUsersController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
  
  get '/user' do
  end

  get '/add' do 
    if ( params['fb_sig_authorize'] )
      user = FbUser.find_by_fb_id[@fb_uid]
      if !user 
        User.find_or_create( {:app_id => @app_configs['id'], :user_id => params['fb_sig_user'], 
                              :global_score => 0, :first_round_score => 0,
                              :round16_score => 0, :quarters_score => 0, :semis_score => 0, :finals_score => 0 } )
      end
    end
    ''
  end
  
  get '/remove' do
    user = User[params['fb_sig_app_id'], params['fb_sig_user']]
    if ( user && params['fb_sig_uninstall'] )
      user.predictions_dataset.destroy
      user.comments_dataset.destroy
      user.delete() 
    end
    ''
  end
  
end



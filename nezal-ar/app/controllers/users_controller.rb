class UsersController < ApplicationController 
  
  enable :sessions
  
  get '/user' do
  end

  get '/add' do 
    LOGGER.debug ">>>>>> Adding New user to : " + @game.name
    if ( params['fb_sig_authorize'] )
      if !@user 
        @user = FbUser.create('fb_id' => @fb_uid)
      end
      @game_profile = UserGameProfile.new()
      @game_profile.game= @game
      @game_profile.user= @user
      get_helper_klass.init_game_profile(@game_profile)
      @game_profile.save!()
    end
    ''
  end
  

  post '/remove' do
    @user = FbUser.where('fb_id' => params['fb_sig_user']).first
    if ( @user && params['fb_sig_uninstall'] )
      @app_configs = FB_CONFIGS::find('id', params['fb_sig_app_id'])
      @game = Game.where( 'name' => @app_configs['name']).first
      @game_profile = UserGameProfile.where('game_id' => @game.id, 'user_id' => @user.id).first 
      LOGGER.debug ">>>>>> Removing user from : " + @game.name  
      if @game_profile
        @game_profil.user_campaigns.destroy
        @game_profile.delete
      end
    end
    ''
  end
  
end



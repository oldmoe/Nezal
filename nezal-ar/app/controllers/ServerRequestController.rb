require 'cgi'
require 'json'

class ServerRequestController < Sinatra::Base

  before do
  
    app_name = env['PATH_INFO'].split('/')[1]
    if app_name
      @app_configs = FB_CONFIGS::find('name', app_name)
      @game = Game.where( 'name' => app_name).first
      @user = FbUser.find( params['user_id'] )
      @game_profile = UserGameProfile.where('game_id' => @game.id, 'user_id' => @user.id).first
    end
    
  end
  
  post '/:game_name/confirmation' do
    redirect payment_fault_redirection unless params['offer'] != "efl3ru5v71w42nzr97fivqtjf"
    coins_amount = (params["amount"].to_i/100).to_s
    @user.coins += GamesController.coin_packages[coins_amount]
    @user.save
    payment = Payment.create!( { :profile_id => @game_profile.id, :price => coins_amount } )
    "OK"
  end
  
  def payment_fault_redirection
    "/fb-games/#{@app_configs["game_name"]}/"
  end
  
end
class FBGamesController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
  
  get '/:game_name' do 
    @friends = FacebookUser.appUserFriends( session[:fb_session_key], session[:fb_user_id] )
    puts @friends
    @game_erb = "#{params[:game_name]}/_#{params[:game_name]}".to_sym
    layout = "#{params[:game_name]}/show".to_sym
    @user_erb = "#{params[:game_name]}/_user".to_sym
    erb @game_erb , {:layout => layout}
  end
  
end








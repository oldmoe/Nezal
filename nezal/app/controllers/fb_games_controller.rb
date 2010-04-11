class FBGamesController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
  
  get '/:game_name' do 
    puts FacebookUser.appUserFriends( session[:fb_session_key], session[:fb_user_id] )
    puts FacebookUser.allUserFriends( session[:fb_session_key], session[:fb_user_id] )
    @game_name = "#{params[:game_name]}/_#{params[:game_name]}".to_sym
    puts @game_name
    erb @game_name , {:layout => :show}
  end
  
end








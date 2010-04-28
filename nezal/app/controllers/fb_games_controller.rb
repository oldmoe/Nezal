class FBGamesController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
  
  get '/:game_name/:campaign_id' do
  
    @game = Game.where(name: params[:game_name]).first
    @current_camp = @game.game_campaigns.where(id: params[:campaign_id]).first

    puts session[:fb_session_key]
    puts session[:fb_session_expires]  
    
    user_info = FacebookUser.getUserInfo( session[:fb_app_id], session[:fb_session_key], [session[:fb_user_id]] )
    @user = FBUser.load(session[:fb_user_id], @game[:id], @current_camp, user_info[0])
    
    @friends = []
    friends = FacebookUser.appUserFriends( session[:fb_app_id], session[:fb_session_key], session[:fb_user_id] )    
    friends.each do |friend|
      @friends << FBUser.load(friend["uid"].to_s, @game[:id], @current_camp, friend)
    end
    
    @friends << @user
    @friends = @friends.sort do |obj1, obj2| 
                                  obj2.user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first[:score] <=>
                                          obj1.user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first[:score]
                            end
      
    layout = "#{params[:game_name]}/show".to_sym
    @game_erb = "#{params[:game_name]}/_#{params[:game_name]}".to_sym
    @user_erb = "#{params[:game_name]}/_user".to_sym
    erb @game_erb , {:layout => layout}    
    
  end

  get '/:game_name' do 

    @game = Game.where(name: params[:game_name]).first
    @current_camp = @game.current_campaign
    
    user_info = FacebookUser.getUserInfo( session[:fb_app_id], session[:fb_session_key], [session[:fb_user_id]] )
    @user = FBUser.load(session[:fb_user_id], @game[:id], @current_camp, user_info[0])    
    @friends = []
    friends = FacebookUser.appUserFriends( session[:fb_app_id], session[:fb_session_key], session[:fb_user_id] ) 
    friends.each do |friend|
      @friends << FBUser.load(friend["uid"].to_s, @game[:id], @current_camp, friend)
    end
    
    @friends << @user
    @friends = @friends.sort do |obj1, obj2| 
                            p obj2.user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first
                            p obj1.user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first
                                  obj2.user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first[:score] <=>
                                          obj1.user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first[:score]
                            end
      
    layout = "#{params[:game_name]}/show".to_sym
    @game_erb = "#{params[:game_name]}/_#{params[:game_name]}".to_sym
    @user_erb = "#{params[:game_name]}/_user".to_sym
    erb @game_erb , {:layout => layout}    
        
  end
    
end








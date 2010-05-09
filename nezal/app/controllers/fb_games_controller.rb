require 'json'

class FBGamesController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
    
  get '/:game_name/:campaign_id' do
    begin 
      @game = Game.where(name: params[:game_name]).first
      @current_camp = @game.game_campaigns.where(id: params[:campaign_id]).first

      @friend_list = {:list => []}
      @friends = getFriendsTopScore(session, @game, @current_camp) 
      @friends.each do | hash |
        @friend_list[:list] << {
          "id" => hash[:user][:id],
          "name" => hash[:user][:user_info]['first_name'],
          "pic_url" => hash[:user][:user_info]['pic_small'],
          "profile_url" => hash[:user][:user_info]['profile_url'],
          "rank" => hash[:user].game_ranks.where(){|rank| rank[:id].index(@game[:id]) == 0 }.first()[:name],
          "campaign" => {
            "order" => hash[:order],
            "score" => hash[:user].user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first()[:score],
          },
          "me" => (session[:fb_user_id]==hash[:user][:id])? true : false,
          "coins" => hash[:user][:coins],
        }
      end
      layout = "#{params[:game_name]}/show".to_sym
      @game_erb = "#{params[:game_name]}/_#{params[:game_name]}".to_sym
      @user_erb = "#{params[:game_name]}/_user".to_sym
      erb @user_erb , {:layout => false}     
    rescue Exception => e
      puts e
      puts e.backtrace
    end
  end

  get '/:game_name' do 
    begin
#      puts ` db_stat -c -h ~/BerkeleyStore/Nezal/ | grep 'Total number'`
#      puts params[:game_name]
      LOGGER.debug "...... Game name : #{params[:game_name]}"
      @game = Game.where(name: params[:game_name]).first()
      @current_camp = @game.current_campaign
      LOGGER.debug "...... Game : #{@game}, Campaign : #{@current_camp}"      
      @friend_list = {:list => []}
      @friends = getFriendsTopScore(session, @game, @current_camp) 
      LOGGER.debug "...... Friends : #{@friends}"

      @friends.each do | hash |
        @friend_list[:list] << {
          "id" => hash[:user][:id],
          "name" => hash[:user][:user_info]['first_name'],
          "pic_url" => hash[:user][:user_info]['pic_small'],
          "profile_url" => hash[:user][:user_info]['profile_url'],
          "rank" => hash[:user].game_ranks.where(){|rank| rank[:id].index(@game[:id]) == 0 }.first()[:name],
          "campaign" => {
            "order" => hash[:order],
            "score" => hash[:user].user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first()[:score],
          },
          "me" => (session[:fb_user_id]==hash[:user][:id])? true : false,
          "coins" => hash[:user][:coins],
        }
      end
      layout = "#{params[:game_name]}/show".to_sym
      @game_erb = "#{params[:game_name]}/_#{params[:game_name]}".to_sym
      @user_erb = "#{params[:game_name]}/_user".to_sym
      LOGGER.debug "END OF REQUEST"
      erb layout , {:layout => false}    
    rescue Exception => e
      LOGGER.error e
      LOGGER.debug "END OF REQUEST WITH EXCEPTION"
    end
  end
    
  get '/:game_name/friends' do 
    puts ` db_stat -c -h ~/BerkeleyStore/Nezal/`
    @game = Game.where(name: params[:game_name]).first

    @current_camp = @game.current_campaign
    begin    
      response = {:list => []}
      @friends = getFriendsTopScore(session, @game, @current_camp) 
      @friends.each do | hash |
        response[:list] << {
          "id" => hash[:user][:id],
          "name" => hash[:user][:user_info]['first_name'],
          "pic_url" => hash[:user][:user_info]['pic_big'],
          "rank" => hash[:user].game_ranks.where(){|rank| rank[:id].index(@game[:id]) == 0 }.first()[:name],
          "campaign" => {
            "order" => hash[:order],
            "score" => hash[:user].user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first()[:score],
          },
          "me" => (session[:fb_user_id]==hash[:user][:id])? true : false,
          "coins" => hash[:user][:coins],
        }
      end
      p response[:list]
    rescue IOError => exception
      { :error => 1, :msg => "Error connecting to facebook" }  
    rescue Exception => exception
      puts exception
      puts exception.backtrace
      { :error => 2, :msg => "Session may have expired. Please try refreshing page" }  
    end 

  end
  
  get '/:game_name/all' do
  
    @game = Game.where(name: params[:game_name]).first
    @current_camp = @game.current_campaign

    begin  
      response = {:list => []}
      @top_scores = getAllTopScore(session, @game, @current_camp)       
      @top_scores.each do | hash |
        response[:list] << {
          "id" => hash[:user][:id],
          "name" => hash[:user][:user_info]['first_name'],
          "pic_url" => hash[:user][:user_info]['pic_big'],
          "rank" => hash[:user].game_ranks.where(){|rank| rank[:id].index(@game[:id]) == 0 }.first()[:name],
          "campaign" => {
            "order" => hash[:order],
            "score" => hash[:user].user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first()[:score],
          },
          "me" => (session[:fb_user_id]==hash[:user][:id])? true : false,
          "coins" => hash[:user][:coins],
        }
      end
      p response[:list]
    rescue IOError => exception
      { :error => 1, :msg => "Error connecting to facebook" }  
    rescue Exception => exception
      puts exception
      puts exception.backtrace
      { :error => 2, :msg => "Session may have expired. Please try refreshing page" }  
    end 
    
  end
  
  
  def getFriendsTopScore(session, game, campaign) 
    LOGGER.debug "...... Getting User info from FB"      
    # Get User info from FB
    user_info = FacebookUser.getUserInfo( session[:fb_app_id], session[:fb_session_key], [session[:fb_user_id]] )
    # Get User Friends info from FB
    LOGGER.debug "...... Getting Friends info from FB"      
    friends_ids = FacebookUser.appUserFriends( session[:fb_app_id], session[:fb_session_key], session[:fb_user_id] ) 
    # Load user & friends game info from the DB
    LOGGER.debug "...... Loading User & Friends game info from DB"      
    user = FBUser.load(session[:fb_user_id], game[:id], campaign, user_info[0])      
    friends = []
    friends_ids.each do |friend|
      friends << FBUser.load(friend["uid"].to_s, game[:id], campaign, friend)
    end
    # Sort the friend list
    LOGGER.debug "...... Sorting Friends list "      
    friends << user
    friends = friends.sort do |obj1, obj2| 
                                obj2.user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first[:score] <=>
                                        obj1.user_campaigns.where{ |camp| camp[:id].index(@game[:id] + @current_camp[:id]) == 0 }.first[:score]
                          end
    # Create the 6 friends list of users
    final_result = []
    user_index = friends.index(user)
    if user_index < 6
        friends[0..6].each_index { |index| final_result << {:user =>friends[index], :order=>index }  if friends[index] }
    else
        friends[0..2].each_index { |index| final_result << {:user =>friends[index], :order=>index } if friends[index] }
        final_result << {:user =>friends[user_index-1], :order=>user_index-1 }
        final_result << {:user =>friends[user_index], :order=>user_index }
        final_result << {:user =>friends[user_index+1], :order=>user_index+1 } if friends[user_index+1] 
    end
    final_result
  end
  
  def getAllTopScore(session, game, campaign)
  
    begin   
      # Get User info from FB
      user_info = FacebookUser.getUserInfo( session[:fb_app_id], session[:fb_session_key], [session[:fb_user_id]] )
      # Load user & friends game info from the DB
      user = FBUser.load(session[:fb_user_id], game[:id], campaign, user_info[0])      
      top_scorers = FBUser.top_scorers( user, game[:id], campaign[:id] )
      
      users = []
      users_ids = []
      top_scorers.each do |user_rec|
        users_ids << user_rec[:user][:id]
      end      
      users_info = FacebookUser.getUserInfo( session[:fb_app_id], session[:fb_session_key], users_ids )
      
      users_info.each do |friend|
        users << FBUser.load(friend["uid"].to_s, game[:id], campaign, friend)
      end
      users
    rescue IOError => exception
      { :error => 1, :msg => "Error connecting to facebook" }  
    rescue Exception => exception
      puts exception
      puts exception.backtrace
      { :error => 2, :msg => "Session may have expired. Please try refreshing page" }  
    end
          
  end
    
end








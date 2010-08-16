#require 'yajl'

class FBGamesController < ApplicationController
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
    
  get '/:game_name/challenges' do
    game = Game.find_by_name(@app_configs["name"])
    camps = Campaign.find_all_by_game_id(game.id)
    #Yajl::Encoder.encode(camps)
	camps.to_json
  end

  get '/:game_name/:campaign_id' do
    
  end

  get '/:game_name' do 
    begin
      layout = "#{params[:game_name]}/show".to_sym
      @game_erb = "#{params[:game_name]}/_#{params[:game_name]}".to_sym
      @user_erb = "#{params[:game_name]}/_user".to_sym
      LOGGER.debug "END OF REQUEST"
#      erb layout , {:layout => false}    
      ''
    rescue Exception => e
      LOGGER.error e
      LOGGER.debug "END OF REQUEST WITH EXCEPTION"
    end
  end
    
  get '/:game_name/friends' do 
    puts ` db_stat -c -h ~/BerkeleyStore/Nezal/`
  end
  
  get '/:game_name/all' do
    
  end
    
end

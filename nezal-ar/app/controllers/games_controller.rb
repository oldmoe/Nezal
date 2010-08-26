<<<<<<< HEAD:nezal-ar/app/controllers/fb_games_controller.rb
#require 'yajl'

class FBGamesController < ApplicationController
=======
class GamesController < ApplicationController
>>>>>>> ea7b5ec12e03a4430db7fb3ef2f8dee6ea7cb8bb:nezal-ar/app/controllers/games_controller.rb
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
    
  get '/:game_name/challenges' do
    game = Game.find_by_name(@app_configs["name"])
    camps = Campaign.find_all_by_game_id(game.id)
<<<<<<< HEAD:nezal-ar/app/controllers/fb_games_controller.rb
    #Yajl::Encoder.encode(camps)
	camps.to_json
=======
    JSON.generate(camps)
>>>>>>> ea7b5ec12e03a4430db7fb3ef2f8dee6ea7cb8bb:nezal-ar/app/controllers/games_controller.rb
  end

  get '/:game_name/friends' do 
    puts ` db_stat -c -h ~/BerkeleyStore/Nezal/`
  end
  
  # get the game object metadata
  get '/:game_name/metadata' do 
    @game = Game.find_by_name(params[:game_name])
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    klass = Kernel.const_get(helper)
    klass.load(@game)
  end
  
  # get the game object metadata
  get '/:game_name/:camp_id/metadata' do 
    @camp = Campaign.find(params["camp_id"])
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    klass = Kernel.const_get(helper)
    klass.load_campaign(@camp)
  end
  
  get '/:game_name/:campaign_id' do
    
  end
    
  get '/:game_name' do 
    puts "not getting the metadata"
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
    
end

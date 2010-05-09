class GamesController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/games'

  get '/admin' do 
    @games = []
    Game.each { |game|  @games << game }
    erb :index , {:layout => :app}
  end
  
  get '/admin/new' do
    erb :new , {:layout => :app}
  end

  get '/admin/:game_name' do 
    Game.each do |game|  
      if game[:name] == params[:game_name]     
        @game = game  
      end
    end
    puts "!!!!!!!!!!!!!!!!!!"
    @game.game_campaigns.each { |campaign| puts campaign }
    puts "!!!!!!!!!!!!!!!!!!"
    erb :show , {:layout => :app}
  end
      
  # Add a new Game
  post '/admin' do
    puts "BEFORE SAVE GAME"
    @game = Game.create({:name => params["name"], :description => params["description"]})
    p @game
    puts "AFTER SAVE GAME"
    redirect "/games/admin/#{@game[:name]}"
  end

  # Delete a game 
  put '/admin/:game_id' do
    puts "BEFORE SAVE GAME"
    @game = Game.create({:name => params["name"], :description => params["description"]})
    p @game
    puts "AFTER SAVE GAME"
    redirect "/games/admin/#{@game[:name]}"
  end

  # Add rank to a game 
  post '/admin/:game_id/ranks' do
    @game = Game.get(params[:game_id])
    @game.ranks << Rank.new({:name => params["name"], :lower_ep => params["lower_ep"], :upper_ep => params["upper_ep"]})
    puts "BEFORE SAVE RANK"
    @game.save
    puts "AFTER SAVE RANK"
    redirect "/games/admin/#{@game[:name]}"
  end

  # Add campaign to a game 
  post '/admin/:game_id/campaigns' do
    @game = Game.get(params[:game_id])
    @game.game_campaigns << Campaign.new({:name => params["name"], :config_path => params["config_path"]})
    puts "BEFORE SAVE CAMPAIGN"
    @game.save
    puts "AFTER SAVE CAMPAIGN"
    redirect "/games/admin/#{@game[:name]}"
  end
  
  # Set current campaign
  post '/admin/:game_id/current-campaign' do 
    @game = Game.get(params[:game_id])
    @game.current_campaign= Campaign.get(params[:current_campaign])
    puts "BEFORE SAVE CAMPAIGN"
    @game.save
    puts "AFTER SAVE CAMPAIGN"
    redirect "/games/admin/#{@game[:name]}"
  end
  
  get '/:game_name' do 
    begin
#      puts ` db_stat -c -h ~/BerkeleyStore/Nezal/ | grep 'Total number'`
#      puts params[:game_name]
      LOGGER.debug "...... Game name : #{params[:game_name]}"
      @game = Game.where(name: params[:game_name]).first()
      @current_camp = @game.current_campaign
      LOGGER.debug "...... Game : #{@game}, Campaign : #{@current_camp}"      

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

  
end








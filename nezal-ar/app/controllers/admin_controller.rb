class AdminController < ApplicationController 
  
  ADMIN_URL = "nezal-admin"

  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/admin'

  get '' do 
    @games = Game.all()
    erb :index , {:layout => :app}
  end
  
  get '/new' do
    erb :new , {:layout => :app}
  end

  get '/:game_name' do 
    Game.all().each do |game|  
      if game.name == params[:game_name]     
        @game = game  
      end
    end
    puts "!!!!!!!!!!!!!!!!!!"
    @game.campaigns.each { |campaign| puts campaign }
    puts "!!!!!!!!!!!!!!!!!!"
    erb :show , {:layout => :app}
  end
      
  # Add a new Game
  post '' do
    puts "BEFORE SAVE GAME"
    @game = Game.create({:name => params["name"], :description => params["description"]})
    p @game
    puts "AFTER SAVE GAME"
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  # Add rank to a game 
  post '/:game_id/ranks' do
    @game = Game.find(params[:game_id])
    @game.ranks << Rank.new({:name => params["name"], :lower_exp => params["lower_exp"], :upper_exp => params["upper_exp"]})
    puts "BEFORE SAVE RANK"
    @game.save
    puts "AFTER SAVE RANK"
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  # Add campaign to a game 
  post '/:game_id/campaigns' do
    @game = Game.find(params[:game_id])
    @game.campaigns << Campaign.new({:name => params["name"], :path => params["config_path"]})
    puts "BEFORE SAVE CAMPAIGN"
    @game.save
    puts "AFTER SAVE CAMPAIGN"
    redirect "/#{ADMIN_URL}/#{@game[:name]}"
  end
  
  # Set current campaign
  post '/:game_id/current-campaign' do 
    @game = Game.find(params[:game_id])
    @game.current_campaign= Campaign.find(params[:current_campaign])
    puts "BEFORE SAVE CAMPAIGN"
    @game.save
    puts "AFTER SAVE CAMPAIGN"
    redirect "/#{ADMIN_URL}/#{@game[:name]}"
  end
  
end

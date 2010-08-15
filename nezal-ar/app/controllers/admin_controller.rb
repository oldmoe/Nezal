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
  
  # Delete a rank
  put '/:game_id/ranks/:rank_id' do
    @game = Game.find(params[:game_id])
    rank = Rank.find(params[:rank_id])
    rank.delete
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
  
  # Delete a campaign
  put '/:game_id/campaigns/:camp_id' do
    @game = Game.find(params[:game_id])
    @game.campaigns.delete(@game.campaigns.find(params[:camp_id]))
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}"
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
  
  # This should be moved to a separate helper 
  # But for now we put it here till we figure out what urls belong to helpers
  # and what urls belong to main AdminController
  get '/:game_name/metadata/edit' do 
    @game = Game.find_by_name(params[:game_name])
    erb "#{@app_configs['game_name']}/show".to_sym , {:layout => :app}
  end
  
  # get the game object metadata
  get '/:game_name/metadata' do 
    @game = Game.find_by_name(params[:game_name])
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    klass = Kernel.const_get(helper)
    klass.load(@game)
  end
  
  # For city defender this should save missions, towers, creeps, super weapons, upgrades
  put '/:game_name/metadata' do 
    @game = Game.find_by_name(params[:game_name])
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    klass = Kernel.const_get(helper)
    klass.edit(@game, params["data"])
    ''
  end
  
  get '/:game_name/:camp_id/metadata/edit' do 
    @camp = Campaign.find(params["camp_id"])
    erb "#{@app_configs['game_name']}/campaign".to_sym , {:layout => :app}
  end
  
  # get the game object metadata
  get '/:game_name/:camp_id/metadata' do 
    @camp = Campaign.find(params["camp_id"])
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    klass = Kernel.const_get(helper)
    klass.load_campaign(@camp)
  end
  
  # For city defender this should save missions, towers, creeps, super weapons, upgrades
  put '/:game_name/:camp_id/metadata' do 
    @camp = Campaign.find(params["camp_id"])
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    klass = Kernel.const_get(helper)
    klass.edit(@camp, params["data"])
    ''
  end
end

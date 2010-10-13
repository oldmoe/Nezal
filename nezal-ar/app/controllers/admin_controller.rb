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
  
  # Add a new Game
  post '' do
    @game = Game.create({:name => params["name"], :description => params["description"]})
    @app_configs = FB_CONFIGS::find('name', @game.name)
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    klass = Kernel.const_get(helper)
    klass.init_game(@game)
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  get '/:game_name' do 
    Game.all().each do |game|  
      if game.name == params[:game_name]     
        @game = game  
      end
    end
    @game.campaigns.each { |campaign| puts campaign }
    erb :show , {:layout => :app}
  end

  # Add rank to a game 
  post '/:game_id/ranks' do
    @game = Game.find(params[:game_id])
    @game.ranks << Rank.new({:name => params["name"], :lower_exp => params["lower_exp"], :upper_exp => params["upper_exp"]})
    @game.save
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
    @game.save
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
    @game.save
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
    klass = self.get_helper_klass
    klass.load_game(@game)
  end
  
  put '/:game_name/metadata' do 
    @game = Game.find_by_name(params[:game_name])
    klass = self.get_helper_klass
    klass.edit_game(@game, params["data"])
    ''
  end
  
  get '/:game_name/:camp_id/metadata/edit' do 
    @camp = Campaign.find(params["camp_id"])
    erb "#{@app_configs['game_name']}/campaign".to_sym , {:layout => :app}
  end
  
  # get the game object metadata
  get '/:game_name/:camp_id/metadata' do 
    @camp = Campaign.find(params["camp_id"])
    @camp.metadata
  end
  
  put '/:game_name/:camp_id/metadata' do 
    @camp = Campaign.find(params["camp_id"])
    klass = self.get_helper_klass
    klass.edit_campaign(@camp, params["data"])
    ''
  end
  get '/:game_name/stats' do
	game = Game.find_by_name(params[:game_name])
	totoalCount = UserGameProfile.count(:conditions => "game_id = #{game.id}")
	newbieCount = UserGameProfile.count(:conditions => "game_id = #{game.id} AND newbie = 't'")
	expneqz = UserGameProfile.count(:conditions => "game_id = #{game.id} AND exp = 0")
	 return "user count = #{totoalCount} ||| newbieCount = #{newbieCount} ||| users exp not equal 0 = #{expneqz}"
  end
end

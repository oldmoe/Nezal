class AdminController < ApplicationController
  
  ADMIN_URL = "nezal-admin"

  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/admin'

  # Serve the add new game page
  get '/new' do
    erb :new , {:layout => :app}
  end

  # View list of all games in Database
  get '/' do 
    @games = Game.all()
    erb :index , {:layout => :app}
  end

  # Add a new Game
  post '/' do
    @game = Game.create({:name => params["name"], :description => params["description"]})
    @app_configs = FB_CONFIGS::find('name', @game.name)
    helper = ActiveSupport::Inflector.camelize(@app_configs['game_name'].sub("-", "_"))
    klass = Kernel.const_get(helper)
    klass.init_game(@game)
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end
  
  # Serve the show.erb to display game details { Ranks, Campaigns .. doesnt include the metadata}
  get '/:game_name' do 
    @game = Game.where(:name => params["game_name"]).first
    @game.campaigns.each { |campaign| puts campaign }
    erb :show , {:layout => :app}
  end

  # Serve the game metadata edit page
  get '/:game_name/metadata/edit' do 
    @game = Game.find_by_name(params[:game_name])
    erb "#{@app_configs['game_name']}/show".to_sym , {:layout => :app}
  end
  
  # Serve the game metadata edit metadata of specific buildings
  get '/:game_name/metadata/edit/building/:name/level/:level' do 
    @game = Game.find_by_name(params[:game_name])
	  @building_name = params[:name]
    @level = params[:level]
	  erb "#{@app_configs['game_name']}/building".to_sym , {:layout => :app}
  end
  
  # Serve the game object metadata
  get '/:game_name/metadata' do 
    @game = Game.find_by_name(params[:game_name])
    klass = self.get_helper_klass
    Metadata.encode(klass.load_game(@game))
  end
  
  # Edit game metadata 
  put '/:game_name/metadata' do
    @game = Game.find_by_name(params[:game_name])
    klass = self.get_helper_klass
    data = params["data"] 
    data ||= params
    klass.edit_game(@game, data)
    redirect "/#{ADMIN_URL}/#{@game.name}/metadata/edit"
  end

  # Add rank to a game 
  post '/:game_id/ranks' do
    @game = Game.find(params[:game_id])
    @game.ranks << Rank.new({:name => params["name"], :lower_exp => params["lower_exp"], :upper_exp => params["upper_exp"]})
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end
  
  # Delete all user game profiles
  # DANGEROUS METHOD !!!!!!!!!!!
  put '/:game_id/user_game_profiles' do
    if( UserGameProfile.count < 50 )
      UserGameProfile.delete_all(["game_id = ?", Game.find_by_name(params[:game_id])])
    end
  end
  
  # Delete a rank
  put '/:game_id/ranks/:rank_id' do
    @game = Game.find(params[:game_id])
    rank = Rank.find(params[:rank_id])
    rank.delete
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  # Set current campaign
  post '/:game_id/current-campaign' do 
    @game = Game.find(params[:game_id])
    @game.current_campaign= Campaign.find(params[:current_campaign])
    @game.save
    redirect "/#{ADMIN_URL}/#{@game[:name]}"
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
  
  # Delete a level
  put '/:game_name/building/:building_name/level/:level' do
    @game = Game.where(:name => params["game_name"]).first
    @building_name = params[:building_name]
    @level = params[:level]
    
    # Get yr building hash, make sure there is a building with that name &  is has levels, then delete the required level
    building = @game.metadata['buildings'][@building_name]
    if building && building['levels']
       building['levels'].delete(@level)
    end
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}/metadata/edit"
  end
  
  #Add new Level
  
  post '/:game_name/building/:building_name/level/new' do
  	@game = Game.where(:name => params["game_name"]).first 
  	building = @game.metadata['buildings'][params[:building_name]]
  	@newLevel = building['levels'].size
  	building['levels'][@newLevel] = building['levels'][building['levels'].keys.last]
  	@game.save
  	redirect "/#{ADMIN_URL}/#{@game.name}/metadata/edit"
  end
  
  # Serve the campaign metadata edit page
  get '/:game_name/campaigns/:camp_id/metadata/edit' do 
    @camp = Campaign.find(params["camp_id"])
    erb "#{@app_configs['game_name']}/campaign".to_sym , {:layout => :app}
  end
  
  # Serve the campaign object metadata
  get '/:game_name/campaigns/:camp_id/metadata' do 
    @camp = Campaign.find(params["camp_id"])
    klass = self.get_helper_klass
    Metadata.encode(klass.load_campaign(@camp))
  end
  
  # Edit campaign metadata 
  put '/:game_name/campaigns/:camp_id/metadata' do 
    @camp = Campaign.find(params["camp_id"])
    klass = self.get_helper_klass
    klass.edit_campaign(@camp, params["data"])
    ''
  end

  ######################################################################
  # Game Quests Requests
  # View list of Quests, Edit Quest page, Add, Remove, Retrieve and Save metadata
  ######################################################################  
  # Serve game quests list display page 
  get '/:game_name/quests' do
    @game = Game.where(:name => params["game_name"]).first
    erb :quests , {:layout => :app}
  end

  # Add a quest to a game 
  post '/:game_name/quests' do
    @game = Game.where(:name => params["game_name"]).first
    parent = if params["parent"] && !(params["parent"].empty?)
              params["parent"]
            else
              nil
            end
    quest = Quest.new({:name => params["name"], :primal => params["primary"], :parent => parent})
    klass = self.get_helper_klass
    klass.init_quest(quest)
    @game.quests << quest
    @game.save
    quest.save
    redirect "/#{ADMIN_URL}/#{@game[:name]}/quests"
  end
  
  # Delete a quest
  put '/:game_name/quests/:quest_id' do
    @game = Game.where(:name => params["game_name"]).first
    @game.quests.delete(@game.quests.find(params[:quest_id]))
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}/quests"
  end

  # Serve the quest metadata edit page
  get '/:game_name/quests/:quest_id/metadata/edit' do 
    @quest = Quest.find(params["quest_id"])
    erb "#{@app_configs['game_name']}/quest".to_sym , {:layout => :app}
  end
  
  # Serve the quest object metadata
  get '/:game_name/quests/:quest_id/metadata' do 
    @quest = Quest.find(params["quest_id"])
    klass = self.get_helper_klass
    Metadata.encode(klass.load_quest(@quest))
  end
  
  # Edit Quest metadata 
  put '/:game_name/quests/:quest_id/metadata' do 
    @quest = Quest.find(params["quest_id"])
    klass = self.get_helper_klass
    klass.edit_quest(@quest, params["data"])
    ''
  end

  get '/:game_name/stats' do
	  game = Game.find_by_name(params[:game_name])
	  totoalCount = UserGameProfile.count(:conditions => "game_id = #{game.id}")
	  newbieCount = UserGameProfile.count(:conditions => "game_id = #{game.id} AND newbie = 't'")
    expneqz = UserGameProfile.count(:conditions => "game_id = #{game.id} AND exp = 0")
    return "user count = #{totoalCount} ||| newbieCount = #{newbieCount} ||| users exp equal 0 = #{expneqz}"
  end

end

class AdminController < ApplicationController
  
  ADMIN_URL = "nezal-admin"

  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/admin'

  # Serve the add new game page
  get '/' do
    erb :index , {:layout => :app}
  end

  # Add a new Game
  post '/' do
    @game = Game.create(params["name"], {"name" => params["name"], "description" => params["description"]})
    puts @game
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  ######################################################################
  # Game Ranks Requests
  # Add, Remove rank requests
  ######################################################################
  post '/:game_name/ranks' do
    @game = Game.get(params[:game_name])
    @game.ranks[params["name"]] = {"name" => params["name"], "lower_exp" => params["lower_exp"], "upper_exp" => params["upper_exp"]}
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end
  
  # Delete a rank
  put '/:game_name/ranks/:rank_name' do
    @game = Game.get(params[:game_name])
    @game.ranks.delete(params[:rank_name])
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  ######################################################################
  # Game Buildings Requests
  # Add, Remove Buildings requests
  ######################################################################
  # Add a new building
  post '/:game_name/buildings' do
    @game = Game.get(params[:game_name])
    @game.buildings[params["name"]] = { 'levels' => {} }
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  # Delete a building
  put '/:game_name/buildings/:name' do
    @game = Game.get(params[:game_name])
    @game.buildings.delete([params["name"]])
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  # Serve the edit building page 
  get '/:game_name/buildings/:name/levels/:level' do 
    @game = Game.get(params[:game_name])
	  @building_name = params[:name]
    @level = params[:level]
	  erb :building , {:layout => :app}
  end

  # Add new Level
  post '/:game_name/buildings/:name/levels/new' do
    @game = Game.get(params[:game_name])
  	building = @game.data['buildings'][params[:name]]
  	@newLevel = building['levels'].size
  	building['levels'][@newLevel] = building['levels'][building['levels'].keys.last]
  	@game.save
  	redirect "/#{ADMIN_URL}/#{@game.name}"
  end

  # Delete a level
  put '/:game_name/buildings/:name/levels/:level' do
    @game = Game.get(params[:game_name])
    @building_name = params[:name]
    @level = params[:level]
    # Get yr building hash, make sure there is a building with that name &  is has levels, then delete the required level
    building = @game.data['buildings'][@building_name]
    if building && building['levels']
       building['levels'].delete(@level)
    end
    @game.save
    redirect "/#{ADMIN_URL}/#{@game.name}"
  end  

  ######################################################################
  # Game Quests Requests
  # View list of Quests, Edit Quest page, Add, Remove, Retrieve and Save metadata
  ######################################################################  
  # Serve game quests list display page 
  get '/:game_name/quests' do
    @game = Game.get(params[:game_name])
    @quests = BD::Quest::all()
    erb :quests , {:layout => :app}
  end

  get '/:game_name/product' do
    @game = Game.get(params[:game_name])
    erb :product , {:layout => :app}
  end
  
  post "/:game_name/product" do
    File.open('public/tsquare/' + params['image_file'][:filename], "w") do |f|
      f.write(params['image_file'][:tempfile].read)
    end
    
    FBHelper.add_product app_configs, 
    
    "The product was successfully submitted!"
  end


  # Add a quest to a game 
  post '/:game_name/quests' do
    BD::Quest.new(params)
    redirect "/#{ADMIN_URL}/#{params[:game_name]}/quests"
  end
  
  # Update / Delete a quest
  # Delete : Put /:game_name/quests/:quest_id
  # update : Put /:game_name/quests/:quest_id.json
  put %r{/([0-9A-Za-z_\-]+)(/quests/)([0-9A-Za-z_\-]+)(.json)?} do
    p params[:captures]
    @game = Game.get(params[:captures][0])
    quest_id = (params[:captures][2])
    if params[:captures][3]
      BD::Quest.edit(quest_id, params["metadata"])
      ''
    else
      BD::Quest.delete(quest_id)
      data = BD::Language.load()
      data.values.each do |language_data|
        language_data['quests'].delete(quest_id)
      end
      BD::Language::save(Nezal::Decoder.encode(data))
      redirect "/#{ADMIN_URL}/#{@game.name}/quests"
    end
  end

  # Serve the quest data edit page
  get '/:game_name/quests/:quest_id' do 
    @game = Game.get(params[:game_name])
    @quests = BD::Quest::all()
    @quest = BD::Quest.find(params["quest_id"])
    erb :quest , {:layout => :app}
  end
  
  # Serve the quest object data
  get '/:game_name/quests/:quest_id/metadata' do 
    @quest = BD::Quest.find(params["quest_id"])
    Nezal::Decoder.encode(@quest)
  end

  ######################################################################
  # Game Language/Locale text files Requests
  ######################################################################
  # Get Language data
  get '/:game_name/locale.json' do 
    @game = Game.get(params[:game_name])
    BD::Language::init()
    Nezal::Decoder.encode(BD::Language::load())
  end

  # Edit Language data
  put '/:game_name/locale.json' do 
    @game = Game.get(params[:game_name])
    BD::Language::save(params['data'])
    ''
  end

  # Serve Language edit page
  get '/:game_name/locale/:language' do 
    @game = Game.get(params[:game_name])
    @language = params[:language]
    @data = BD::Language.load()
    erb :language , {:layout => :app}
  end

  ######################################################################
  # Game requests
  # Serve default game page located under admin, game specific edit game page (show.erb) under the game directory 
  # Serve game metadata, save metadata requests
  ######################################################################
  # Serve the show.erb to display game details { Ranks .. doesnt include the metadata}
  get %r{/([0-9A-Za-z_\-]+)(.json)?} do
    @game = Game.get(params[:captures][0])
    if params[:captures][1]
      Nezal::Decoder.encode(@game.data)
    else
      erb :show , {:layout => :app}
    end
  end
  
  # Edit game metadata object
  put %r{/([0-9A-Za-z_\-]+).json} do
    @game = Game.get(params[:captures][0])
    data = params["data"]
    @game.data= Nezal::Decoder.decode(data)
    @game.save
  end

  ######################################################################
  # Administrative Requests
  ######################################################################
  # Delete all user game profiles
  # DANGEROUS METHOD !!!!!!!!!!!
  put '/:game_id/user_game_profiles' do
    if( UserGameProfile.count < 50 )
      UserGameProfile.delete_all(["game_id = ?", Game.find_by_name(params[:game_id])])
    end
  end

  get '/:game_name/stats' do
	  game = Game.find_by_name(params[:game_name])
	  totoalCount = UserGameProfile.count(:conditions => "game_id = #{game.id}")
	  newbieCount = UserGameProfile.count(:conditions => "game_id = #{game.id} AND newbie = 't'")
    expneqz = UserGameProfile.count(:conditions => "game_id = #{game.id} AND exp = 0")
    return "user count = #{totoalCount} ||| newbieCount = #{newbieCount} ||| users exp equal 0 = #{expneqz}"
  end

end


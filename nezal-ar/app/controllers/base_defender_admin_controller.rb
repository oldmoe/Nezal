class BaseDefenderAdminController < AdminController

  # Serve the game metadata edit metadata of specific buildings
  get '/:game_name/metadata/edit/building/:name/level/:level' do 
    @game = Game.find_by_name(params[:game_name])
	  @building_name = params[:name]
    @level = params[:level]
	  erb "#{@app_configs['game_name']}/building".to_sym , {:layout => :app}
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

  # Add new Level
  post '/:game_name/building/:building_name/level/new' do
  	@game = Game.where(:name => params["game_name"]).first 
  	building = @game.metadata['buildings'][params[:building_name]]
  	@newLevel = building['levels'].size
  	building['levels'][@newLevel] = building['levels'][building['levels'].keys.last]
  	@game.save
  	redirect "/#{ADMIN_URL}/#{@game.name}/metadata/edit"
  end

  # Init Language Data
  put '/:game_name/locale/metadata/init' do 
    @game = Game.where(:name => params["game_name"]).first
    language = params["language"]
    klass = self.get_helper_klass
    Metadata.encode(klass.init_language_data(@game, language))
  end

end

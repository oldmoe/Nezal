var LevelEditor = Class.create({
	
	settings: {},
	grid : null,
	message: null,
	dataExporter: null,
	dataLoader: null,
	backgroundHandler: null,
	levelObjectsHandler: null,
	settingsHandler: null,
	loSettingsHandler: null,
	tileDataHandler: null,
	
	initialize: function(){
		
		this.dataLoader = new DataLoader(this);
		this.message = new Message(this);
		this.dataExporter = new DataExporter(this);
		this.grid = new Grid(this);
		this.backgroundHandler = new BackgroundHandler(this);
		this.sevelObjectsHandler = new LevelObjectsHandler(this);
		this.settingsHandler = new SettingsHandler(this);
		this.loSettingsHandler = new LOSettingsHandler(this);
		this.tileDataHandler = new TileDataHandler(this);
	},
	
	
});

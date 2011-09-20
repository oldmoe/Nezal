var gameData = 
  {"data":[[],[
  {"name":"journalist","category":"crowd","index":0,"lane":1,"x":1,"order":0},
  {"name":"journalist","category":"crowd","index":0,"lane":1,"x":2,"order":0}, 
  {"name":"journalist","category":"crowd","index":0,"lane":1,"x":3,"order":0},
  {
      "name": "wood_stick_cs",
      "category": 'enemy',
      "type": '3_3',
      "index": 0,
      "lane": 1,
      "x": 10,
      "order": 1
  }, 
     {
      "category": "enemy",
      "name" : "wood_stick_cs",
      "type" : '1_1',
      "lane": 1,
      "x": 17,
      "index": 0
    }]],
    
   "backgrounds":{
     "layer1":[{"name":"secondary_skyline.png"}],
     "layer2":[{"name":"main_skyline.png"}],
     "landmarks":[{"name":"landmark_1.png"},{"name":"landmark_2.png"}],
     "fence":[{"name":"fence.png"}],
     "lamp":[{"name":"3amod.png"}],
     "land":[{"name":"land.png"}]},
     
     "environment":"day","gameModes":["normal"]}
   
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
	}	
});

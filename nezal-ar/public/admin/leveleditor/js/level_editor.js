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
    
   "backgrounds":[[{"name":"skyline.png"}],[{"name":"skyline.png"}],[{"name":"sky1.png"}]],"environment":"day","gameModes":["normal"]} 

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
		
		this.loadMissionData();
	},
	
	loadMissionData: function(){
	  // var data = Mission.currMission.data;
	  var missionData = gameData;
	  var objects = missionData.data;
    
    var laneLength = 0;
    for (var i=0; i < objects.length; i++) {
      for (var j=0; j < objects[i].length; j++) {
        if(laneLength < objects[i][j].x)
          laneLength = objects[i][j].x;
      };
    };
    
    this.grid.adjustLength(laneLength);
	  
	  for (var i=0; i < objects.length; i++) {
	    for (var j=0; j < objects[i].length; j++) {
	      this.grid.lanes[i].tiles[objects[i][j].x-1].loadObject(this.loadImagePath(objects[i][j]));
			};
		};
		
		
		
	},
	
	loadImagePath: function(obj){
	  for (var i=0; i < EditorData.length; i++) {
	    if(obj.name == EditorData[i].name && obj.category == EditorData[i].category){
	      if(obj.type){
  	      if(obj.type == EditorData[i].type){
            obj.image = EditorData[i].src;
            break;
  	      }
	      }else{
          obj.image = EditorData[i].src;
          break;
	      }
	    }
		};
		return obj;
	}
	
	
});

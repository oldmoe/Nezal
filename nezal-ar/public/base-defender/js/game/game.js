var Game = Class.create({
  disableJsValidation: true,
  network : null,
  gameStatus : null,
  scene : null,
  data : null,
  user : null,
  tutorial : null,
  buildingMode : null,
  townhall : null,
  workers : null,
  idleWorkers : null,
  resources : {
    rock : 0,
    iron : 0
  },
  
  initialize : function(){
    this.network = new Network();
    this.scene = new BaseDefenderScene(this);
    this.buildingMode = new BuildingMode(this);
  },
  
  start : function(){
    var thisScene = this.scene;
    thisScene.groundLayer = new Layer($('gameBackground').getContext('2d'));
    thisScene.layers.push(thisScene.groundLayer);
    
    thisScene.buildingsLayer = new Layer($('gameForeground').getContext('2d'));
    thisScene.layers.push(thisScene.buildingsLayer);
    
    this.gameStatus = this.network.initializeGame();
    this.data = JSON.parse(this.gameStatus.game_data.metadata);
    this.reflectStatusChange();
    
    var buildingImages = this.buildingMode.buildings.collect(function(building){
      return building + ".png";
    });
    new Loader().load([{images : thisScene.textures, path: 'images/textures/', store: 'textures'},
                       {images : buildingImages, path: 'images/buildings/', store: 'buildings'},
                       {images : [this.buildingMode.inProgressImage], path: 'images/buildings/', store: 'buildings'}],
      {onFinish : function(){thisScene.render();}
    });
    
    //Just triggering a null move to disable the top and left navigation triggers
    this.scene.navigation.move(0,0);
    
  },
  
  upgradeBuilding : function(name, coords){
    var response = this.network.upgradeBuilding(name, coords);
    this.gameStatus = response['gameStatus'];
    this.reflectStatusChange();
    this.scene.render();
    return response['upgradeDone']
  },
  reflectStatusChange : function(){
    this.user = new User(this);
    this.workers = this.user.data.workers;
    this.idleWorkers = this.user.data.idle_workers;
    this.rock = this.user.data.rock;
    this.iron = this.user.data.iron;
    
    this.townhall = new Townhall(this);
    this.tutorial = new Tutorial(this);
    
    this.scene.map = this.user.data["map"];
    this.scene.navigation.blocks.vertical = this.scene.map.length;
    this.scene.navigation.blocks.horizontal = this.scene.map[0].length;
  }
});
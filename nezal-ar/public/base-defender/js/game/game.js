var Game = Class.create({
  disableJsValidation: false,
  templatesManager : null,
  selectedBuildingPanel : null,
  workerFactory : null,
  reactor : null,
  network : null,
  gameStatus : null,
  scene : null,
  data : null,
  user : null,
  tutorial : null,
  buildingMode : null,
  townhallFactory : null,
  quarryFactory : null,
  mineFactory : null,
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
    
    this.templatesManager = new TemplatesManager(this.network);
    
    //The below code needs rewrite///
    var self = this;
    var mapView = "<div>Map View</div>";
    var friendIDs = this.network.neighbourIDs();
    var mapping = {};
    var ids = []
    friendIDs.each(function(user, index){
                  mapping[user["service_id"]] = { "index" : index };
                  ids[index]= user["service_id"]
                })
    // getUsersInfo takes array of service_ids & a hash of service_ids to fill with retrieved names
		serviceProvider.getUsersInfo(ids, mapping , function(){
                                            friendIDs.each(function(friendID, i){
                                              if(mapping[friendID["service_id"]].name)
                                                friendID["name"] = mapping[friendID["service_id"]].name
                                              else
                                                friendID["name"] = friendID["service_id"]
                                              mapView += self.templatesManager.friendRecord(friendID["user_id"], friendID["name"]);
                                            });
                                            $('friends').innerHTML = mapView;
                                        });
    //////////////////////////////////
    
    this.reInitialize();
    
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
  
  reInitialize : function(callback){
    this.gameStatus = this.network.initializeGame();
    this.data = this.gameStatus.game_data.metadata;
    
    this.reflectStatusChange();
    
    if(callback) callback();
  },
  
  updateGameStatus : function(gameStatus){
    this.gameStatus = gameStatus;
    this.reflectStatusChange();
    this.scene.render();
  },
  
  reflectStatusChange : function(){
    if(this.reactor) this.reactor.stop();
    this.reactor = new Reactor(500);
    this.reactor.run();
    
    this.user = new User(this);
    this.workerFactory = new WorkerFactory(this);
    this.resources.rock = this.user.data.rock;
    this.resources.iron = this.user.data.iron;
    
    BuildingFactory._GlobalRegistry = {};
    this.townhallFactory = new TownhallFactory(this);
    this.quarryFactory = new QuarryFactory(this);
    this.mineFactory = new MineFactory(this);
    this.tutorial = new Tutorial(this);
    
    this.scene.map = this.user.data["map"];
    this.scene.navigation.blocks.vertical = this.scene.map.length;
    this.scene.navigation.blocks.horizontal = this.scene.map[0].length;
  },
  
  loadUserEmpire : function(user_id){
    this.gameStatus.user_data = this.network.neighbourEmpire(user_id);
    this.updateGameStatus( this.gameStatus );
  }
});

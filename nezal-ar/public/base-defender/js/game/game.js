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
  lumbermillFactory : null,
  neighborGame : null,
	reInitializationNotifications : [],
  resources : {
    rock : 0,
    lumber : 0
  },
  
  initialize : function(){
    this.network = new Network();
  },
  
  start : function(){
    //The below code needs rewrite///
    var self = this;
		
		var loaderFinishCallback = function(){
			self.templatesManager = new TemplatesManager(self.network);
			
      //The below code needs rewrite///			
  		var mapView = ""
      var friendIDs = self.network.neighbourIDs();
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
          mapView += self.templatesManager.friendRecord(friendID["user_id"], friendID["service_id"], friendID["name"]);
        });
        $('friends-ul').innerHTML = mapView;
        var images = {
                    'left' : 'images/friends/left.png',
                    'left-disabled' : 'images/friends/left-disabled.png',
                    'right' : 'images/friends/right.png',
                    'right-disabled' :'images/friends/right-disabled.png'
                    };
        var friendsCarousel = null;
        friendsCarousel = new Carousel("friends", images, 3);
        friendsCarousel.checkButtons();
      });
    //////////////////////////////////
			self.reInitialize();
		};
		
		var buildingImages = BuildingMode.prototype.buildings.collect(function(building){
      return building + ".png";
    });
		var buildingOutlineImages = BuildingMode.prototype.buildings.collect(function(building){
      return building + "_outline.png";
    });
		var buildingModeImages = ['2x2_invalid.png', '2x2_base.png'];
		var questsImages = ["msgBg.png", "wedge.png", "button.png", "bubble.png", "questBg.png", "buildingPanelBg.png", "activeCell.png", "inactiveCell.png"];
    var iconsImages = ["townhall.png", "quarry.png", "lumbermill.png", "lumber.png", "rock.png"];
    new Loader().load([{images : BaseDefenderScene.prototype.textures, path: 'images/textures/', store: 'textures'},
                       {images : buildingImages, path: 'images/buildings/', store: 'buildings'},
											 {images : buildingModeImages, path: 'images/buildings/', store: 'buildingModes'},
											 {images : iconsImages, path: 'images/icons/', store: 'icons'},
											 {images : questsImages, path: 'images/quests/', store: 'quests'},
											 {images : buildingOutlineImages, path: 'images/buildings/outlines/', store: 'buildingOutlines'}],
      {onFinish : loaderFinishCallback});
	
  },
  
  reInitialize : function(callback){
    this.neighborGame = false;
    this.gameStatus = this.network.initializeGame();
    this.data = this.gameStatus.game_data.metadata;
    
    this.reflectStatusChange();
    this.scene.render();
  },
  
  updateGameStatus : function(gameStatus){
    this.gameStatus = gameStatus;
    this.reflectStatusChange();
    this.scene.render();
  },
  
  reflectStatusChange : function(){
		this.reInitializationNotifications = [];
    if(this.reactor) this.reactor.stop();
    this.reactor = new Reactor(33);
    this.reactor.run();
    
    this.buildingMode = new BuildingMode(this);
    this.user = new User(this);
		this.scene = new BaseDefenderScene(this);	
    this.workerFactory = new WorkerFactory(this);
    this.resources.rock = this.user.data.rock;
    this.resources.lumber = this.user.data.lumber;
    
    BuildingFactory._GlobalRegistry = {};
    this.townhallFactory = new TownhallFactory(this);
    this.quarryFactory = new QuarryFactory(this);
    this.lumbermillFactory = new LumbermillFactory(this);
		this.questsManager = new QuestsManager(this);
    this.buildingsManager = new BuildingsManager(this);

    this.tutorial = new Tutorial(this);
    this.tutorial.fire();
    this.reInitializationNotifications.each(function(fn){fn()});
/*    if(!this.neighborGame)
      new Notification(this).showAll();*/

  },
  
  loadUserEmpire : function(user_id){
    this.gameStatus.user_data = this.network.neighbourEmpire(user_id);
    this.neighborGame = true;
    this.updateGameStatus( this.gameStatus );
    this.scene.adjustNeighborScene();
  }
});

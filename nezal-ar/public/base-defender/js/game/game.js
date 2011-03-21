var Game = Class.create({
  disableJsValidation: false,
  templatesManager : null,
  selectedBuildingPanel : null,
  workerFactory : null,
  researchManager : null,
  reactor : null,
  network : null,
  gameStatus : null,
  scene : null,
  data : null,
  user : null,
  tutorial : null,
  buildingMode : null,
  townhallFactory : null,
	creepFactory : null,
  quarryFactory : null,
  lumbermillFactory : null,
  neighborGame : null,
  mouseStartEvent : null,
  mouseEndEvent : null,
  mouseClickEvent : null,
  mouseMoveEvent : null,
  reInitializationNotifications : [],
  resources : {
    rock : 0,
    lumber : 0
  },
  //Batoota Code
  workersStatus : null,
  initialize : function(){
    this.network = new Network();
	if(!this.isTouchDevice()){
		this.mouseClickEvent = 'click'
		this.mouseStartEvent = 'mousedown'
		this.mouseEndEvent = 'mouseup'
		this.mouseMoveEvent = 'mousemove'
		
	}else{
		this.mouseClickEvent = 'touchstart'
		this.mouseStartEvent = 'touchstart'
		this.mouseEndEvent = 'touchend'
		this.mouseMoveEvent = 'touchmove'
	}
  },
	
	startLoading : function(){
		var self = this
		this.templatesManager = new TemplatesManager(this.network);
		new Loader().load([{images : ['logo.png'], path: 'images/loading/', store: 'loading'}],
							{onFinish : function(){
								$('inProgress').show()
								$('inProgress').innerHTML = self.templatesManager.loadingScreen()
								self.initializeGame()
							}})
	},
	
  initializeGame : function(){
		var self = this
		var gameElementsImages = ['upper_bar.png','monitor.png','background.png','cancel.png','cancel.png']
		var friendsImages = ['1st_blank.png']
		var buildingImages = ['townhall.png']
		var panelImages = ['buttons.png']
		var questsImages = [  "msgBg.png", "wedge.png", "button.png", "msgBaloon.png", "questBaloon.png" , "questBg.png", "buildingPanelBg.png",
                          "activeCell.png", "inactiveCell.png", "resources.png", "correct.png", "correct.png", "buildingsBg.png", "wedgesBg.png", 
                          'button.png','cursor.png',"social.png", "civil.png", "military.png", "circles.png", "hover.png", "animated_circles.gif"];
													
		new Loader().load([{images : gameElementsImages, path: 'images/game_elements/', store: 'game_elements'},
                       {images : friendsImages, path: 'images/friends/', store: 'friends'},
											 {images : questsImages, path: 'images/quests/', store: 'quests'},
											 {images : panelImages, path: 'images/buildings/panel/', store: 'panel'},
											 {images : buildingImages, path: 'images/buildings/', store: 'buildings'}
				],
      {onProgress : function(progress){
					$$('#inProgress #loadingBarFill')[0].style.width = Math.min(progress,88)+"%"
				},
				onFinish: function(){
					$('gameContainer').innerHTML = game.templatesManager.gameElements()
					Map.initializeMapSize()
					self.questsManager = new QuestsManager(self);
					$('inProgress').hide()
					$('gameContainer').show()
					game.start()
	  }});
	},
	
  start : function(){
	    var self = this;
		var loaderFinishCallback = function(){
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
        friendsCarousel = new Carousel("friends", images, 5);
        friendsCarousel.checkButtons();
      });
    //////////////////////////////////
			self.reInitialize();
			Sounds.gameSounds.game.volume = 10
		};
		
		var buildingImages = BuildingMode.prototype.buildings.collect(function(building){
      return building + ".png";
    });
		buildingImages.push("lumbermill_saw.png");
		buildingImages.push("townhall_door.png");
		buildingImages.push("wedge_face.png");
		buildingImages.push("storage_2.png");
		var buildingOutlineImages = BuildingMode.prototype.buildings.collect(function(building){
      return building + "_outline.png";
    });
		buildingOutlineImages.push("storage_outline_2.png");

		var buildingShadowImages = BuildingMode.prototype.buildings.collect(function(building){
      return building + "_shadow.png";
    });
    
    var buildingMovingImages = [ "wedge_moving.png" ];

		var buildingModeImages = ['2x2_invalid.png', '2x2_base.png','1x1_invalid.png', '1x1_base.png','transparent.png','transparent.png'];
		var questsImages = [  "msgBg.png", "wedge.png", "button.png", "msgBaloon.png", "questBaloon.png" , "questBg.png", "buildingPanelBg.png",
                          "activeCell.png", "inactiveCell.png", "resources.png", "correct.png", "correct.png", "buildingsBg.png", "wedgesBg.png", 
                          "social.png", "civil.png", "military.png", "circles.png", "hover.png", "animated_circles.gif", "line.png",
                          "townhall_info.png", "quarry_info.png", "lumbermill_info.png", "defense_center_info.png", "storage_info.png",
                          "wedge_info.png"];

    var iconsImages = ["townhall.png", "townhall_icon.png", "quarry_icon.png", "lumbermill_icon.png", "quarry.png",
		 "lumbermill.png", "lumber.png", "rock.png", "workers.png","storage.png","storage_icon.png",
		 "defense_center.png","defense_center_icon.png", "wedge_icon.png", "wedge.png","attention.png"];
   
		var workerImages = ["worker.png", "worker_shadow.png"];
    //var buildingPanelImages = ["panel.png"]
		
		var creepsImages = ["car.png",'explosion.png','car_fight.png']
		//This is duplicated to avoid a problem in the loader that can't deal with an array of a single item
		var smokeImages = ["smoke_big.png", "smoke_big.png"]
  
    // Weapons Images 
		var weaponsImages = ["archer.png", "rock.png"]
    new Loader().load([{images : BaseDefenderScene.prototype.textures, path: 'images/textures/', store: 'textures'},
                       {images : buildingImages, path: 'images/buildings/', store: 'buildings'},
											 {images : buildingModeImages, path: 'images/buildings/', store: 'buildingModes'},
											 {images : iconsImages, path: 'images/icons/', store: 'icons'},
										 	 {images : workerImages, path: 'images/worker/', store: 'worker'},
											 {images : creepsImages, path: 'images/creeps/', store: 'creeps'},
                       {images : smokeImages, path: 'images/', store: 'smoke'},
											 {images : buildingOutlineImages, path: 'images/buildings/outlines/', store: 'buildingOutlines'},
											 {images : buildingShadowImages, path: 'images/buildings/shadows/', store: 'buildingShadows'},
											 {images : buildingMovingImages, path: 'images/buildings/moving/', store: 'buildingMoving'},
											 {images : weaponsImages, path: 'images/weapons/', store: 'weapons'}],
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
    this.reactor = new Reactor(80);
    this.reactor.run();
    this.attackManager = new AttackManager(this);
    this.buildingMode = new BuildingMode(this);
    this.user = new User(this);
		this.scene = new BaseDefenderScene(this);	
   	this.resources.rock = this.user.data.rock;
    this.resources.lumber = this.user.data.lumber;
    BuildingFactory._GlobalRegistry = {};
		this.attackManager = new AttackManager(this);
    this.townhallFactory = new TownhallFactory(this);
    this.quarryFactory = new QuarryFactory(this);
    this.lumbermillFactory = new LumbermillFactory(this);
    this.buildingsManager = new BuildingsManager(this);
		this.workerFactory = new WorkerFactory(this);
		this.storageFactory = new StorageFactory(this);
		this.creepFactory = new CreepFactory(this);
		this.defenseCenterFactory = new DefenseCenterFactory(this);
		this.wedgeFactory = new WedgeFactory(this);
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
  },
  isTouchDevice: function(){
  	try {
  		document.createEvent("TouchEvent");
  		return true;
  	} 
  	catch (e) {
  		return false;
  	}
  }
});

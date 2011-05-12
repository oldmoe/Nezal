var Text = {}

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
  zoomFactor : 1,
  reInitializationNotifications : [],
  resources : {
    rock : 0,
    lumber : 0
  },
  loadTime : null,

  workersStatus : null,

  initialize : function(){
    this.loadTime = new Date().getTime();
    this.network = new Network(); 
  	if(!this.isTouchDevice()){
  		this.mouseClickEvent = 'click'
  		this.mouseStartEvent = 'mousedown'
  		this.mouseEndEvent = 'mouseup'
  		this.mouseMoveEvent = 'mousemove'
  	} else {
  		this.mouseClickEvent = 'touchstart'
  		this.mouseStartEvent = 'touchstart'
  		this.mouseEndEvent = 'touchend'
  		this.mouseMoveEvent = 'touchmove'
    }
    //soundManager.mute()
  },
	
  startLoading : function(){
    var self = this
    this.templatesManager = new TemplatesManager(this.network);
    new Loader().load([{images : ['logo.png'], path: 'images/loading/', store: 'loading'}],
                      {onFinish : function(){
                         $('inProgress').show();
                        $('inProgress').innerHTML = self.templatesManager.load("loadingScreen");
 					            self.addLoadedImagesToDiv('inProgress');
                        self.initializeGame();
                      }});
  },
	
  initializeGame : function(){
    var self = this
    var gameElementsImages = ['upper_bar.png','monitor.png','background.png','cancel.png','button.png','move.png','flag.png',
                              'zoom.png','hover.png','sound.png','music.png','control_button.png','click.png','panel_background.png',
                            	'resource_meter_background.png','resource_meter_rock.png','resource_meter_wood.png','button_clicked.png',
                            	'building_menu_hover.png', 'build_button.png']
                              
    var friendsImages = ['1st_blank.png', 'bar.png']
    var buildingImages = ['townhall.png']
    var panelImages = ['buttons.png']
    var questsImages = [  "msgBg.png", "wedge.png", "button.png", "msgBaloon.png", "questBaloon.png" , "questBg.png", "buildingPanelBg.png",
                          "resources.png", "correct.png", "buildingsBg.png", "wedgesBg.png", 
                          'button.png','cursor.png',"social.png", "civil.png", "military.png", "circles.png", "hover.png", "animated_circles.gif", 
                          "line.png", "resources_needed_for_building.png", "building_hover.png", "building_hover_arrow.png", "empty.png"];
    questsImages = questsImages.concat(BuildingMode.prototype.buildings.collect(function(building){
                                                                      return building + "_info.png";
                                                                  }));
    questsImages = questsImages.concat(BuildingMode.prototype.buildings.collect(function(building){
                                                                      return building + "_info_dimmed.png";
                                                                  }));
    var specialDefaultActionImages = ['assign_worker.png', 'move.png']
    new Loader().load([ {images : gameElementsImages, path: 'images/game_elements/', store: 'game_elements'},
                        {images : friendsImages, path: 'images/friends/', store: 'friends'},
                        {images : questsImages, path: 'images/quests/', store: 'quests'},
                        {images : panelImages, path: 'images/buildings/panel/', store: 'panel'},
                        {images : buildingImages, path: 'images/buildings/', store: 'buildings'},
                        {images : specialDefaultActionImages, path: 'images/buildings/special_default_actions/', store: 'default_actions'}
                      ],
                      {
                        onProgress : function(progress){
                          $$('#inProgress #loadingBarFill')[0].style.width = Math.min(progress,88)+"%"
                        },
                        onFinish: function(){
                          $('gameContainer').innerHTML = game.templatesManager.load("gameElements");
                          self.addLoadedImagesToDiv('gameContainer')
                          Map.initializeMapSize()
                          self.questsManager = new QuestsManager(self);
                          self.domConverter = new DomConverter();
                          $('inProgress').hide()
                          $('gameContainer').show()
                          game.start()
                        }
                      });
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
        });
        // getUsersInfo takes array of service_ids & a hash of service_ids to fill with retrieved names
        serviceProvider.getUsersInfo(ids, mapping , function(){
          friendIDs.each(function(friendID, i){
            if(mapping[friendID["service_id"]].name)
              friendID["name"] = mapping[friendID["service_id"]].name
            else
              friendID["name"] = friendID["service_id"]
            
            mapView += self.templatesManager.load("friend-record", 
                      {'friendId' : friendID["user_id"], 'serviceId' : friendID["service_id"], 'friendName' : friendID["name"]} );
          });
          $('friends-ul').innerHTML = mapView;
          var images =  {
                          'left' : 'images/quests/arrows_horizontal.png',
                          'left-disabled' : 'images/quests/arrows_horizontal.png',
                          'right' : 'images/quests/arrows_horizontal.png',
                          'right-disabled' :'images/quests/arrows_horizontal.png'
                        }
          var friendsCarousel = null;
          friendsCarousel = new Carousel("friends", images, 5);
          friendsCarousel.checkButtons();
        });
        //////////////////////////////////
        self.reInitialize();
        Sounds.gameSounds.Intro[0].stop()
        Sounds.resumeTrack()
    };	
    var buildingImages = BuildingMode.prototype.buildings.collect(function(building){
      return building + ".png";
    });
    var wedgeFaceImages = BuildingMode.prototype.wedges.collect(function(building){
      return building + "_face.png";
    });
    buildingImages = buildingImages.concat(wedgeFaceImages);
    buildingImages.push("lumbermill_saw.png");
    buildingImages.push("townhall_door.png");
    buildingImages.push("storage_2.png");

    var buildingOutlineImages = BuildingMode.prototype.buildings.collect(function(building){
      return building + "_outline.png";
    });
    buildingOutlineImages.push("storage_outline_2.png");

    var buildingShadowImages = BuildingMode.prototype.buildings.collect(function(building){
      return building + "_shadow.png";
    });
    
    var buildingMovingImages = BuildingMode.prototype.wedges.collect(function(building){
      return building + "_moving.png";
    });

    var buildingModeImages = ['3x3_invalid.png','3x3_base.png','2x2_invalid.png', '2x2_base.png','1x1_invalid.png',
	 '1x1_base.png','construction_tile_1x1.png','construction_tile_2x2.png','construction_tile_3x3.png','construction_smoke.png',
	 'transparent.png','transparent.png'];


    var iconsImages = [ "lumber.png", "rock.png", "workers.png", "attention.png" ];
    iconsImages = iconsImages.concat( BuildingMode.prototype.buildings.collect(function(building){
                                        return building + ".png";
                                      }));
    iconsImages = iconsImages.concat( BuildingMode.prototype.buildings.collect(function(building){
                                        return building + "_icon.png";
                                      }));

    var workerImages = ["worker.png", "worker_shadow.png"];
    //var buildingPanelImages = ["panel.png"]
		
    var creepsImages = ["car.png",'explosion.png','car_fight.png']
		//This is duplicated to avoid a problem in the loader that can't deal with an array of a single item
    var smokeImages = ["smoke_big.png", "smoke_big.png"]
  
    // Weapons Images 
		var weaponsImages = ["slingshot.png", "rock.png", "green_book.png"]
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
  	$('home').hide()
    this.gameStatus = this.network.initializeGame();
    this.data = this.gameStatus.game_data.metadata;
    var self = this;
    Language.getLanguage(this.gameStatus.user_data.locale, function() {
      var language = Language.userLanguage;
      if(!Language[language])
      {
        self.network.fetchTemplate( "statics/" + language + ".html", function(responseText){
          Language[language] = responseText;
          Text = JSON.parse(responseText);
          self.reflectStatusChange();
          self.scene.render();
        });
      }else{
        self.reflectStatusChange();
        self.scene.render();
      }
    });
  },

  selectLanguage : function(lang){
    var self = this;
    Language.select(lang, function(){
      var language = Language.userLanguage;
      self.network.fetchTemplate( "statics/" + language + ".html", function(responseText){
        Text = JSON.parse(responseText);
        self.reflectStatusChange();
        self.scene.render();
      });
    });
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
    this.user = new User(this);
	  this.attackManager = new AttackManager(this);
    this.scene = new BaseDefenderScene(this);	
    this.resources.rock = this.user.data.rock;
    this.resources.lumber = this.user.data.lumber;
    BuildingFactory._GlobalRegistry = {};
    this.attackManager = new AttackManager(this);
    this.townhallFactory = new TownhallFactory(this);
  	this.storageFactory = new StorageFactory(this);
    this.quarryFactory = new QuarryFactory(this);
    this.lumbermillFactory = new LumbermillFactory(this);
    this.buildingsManager = new BuildingsManager(this);
    this.workerFactory = new WorkerFactory(this);
    this.creepFactory = new CreepFactory(this);
    this.defenseCenterFactory = new DefenseCenterFactory(this);
    this.warFactoryFactory = new WarFactoryFactory(this);
    this.houseFactory = new HouseFactory(this);
    this.workerPanel = new WorkerPanel();
	  this.palmFactory = new PalmFactory(this);
    this.wedgeFactory = new WedgeFactory(this);
    this.gaddafiFactory = new GaddafiFactory(this);
    if( !this.buildingMode )
      this.buildingMode = new BuildingMode(this);
    else{
      var selectedBuilding = this.buildingMode.selectedBuilding;
      if( selectedBuilding && selectedBuilding.state == selectedBuilding.states.NOT_PLACED ){
        
        var newBuilding = this[selectedBuilding.name.dasherize().camelize() + 'Factory'].newBuilding();
        this.buildingMode.on( newBuilding, function(){} );
      }
    }
    if(!this.neighborGame)this.rewardsPanel = new RewardsPanel(this)
    this.controlsPanel = new ControlsPanel(this)
    this.tutorial = new Tutorial(this);
    if(!game.neighborGame) {
      this.tutorial.fire();
    }
    this.reInitializationNotifications.each(function(fn){fn()});
/*    if(!this.neighborGame)
      new Notification(this).showAll();*/

  },
  
  loadUserEmpire : function(user_id){
  	$('home').show()
    this.gameStatus.user_data = this.network.neighbourEmpire(user_id);
    this.neighborGame = true;
    this.visitedNeighborId = user_id
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
  },

  addLoadedImagesToDiv : function(divId){
    $$('#'+divId+' .loadedImg').each(function(imgSpan){
      var classes = null
      if(imgSpan.getAttribute('imgClasses')){
	      var classes = imgSpan.getAttribute('imgClasses').split('-')
      }
      var imgPath = imgSpan.getAttribute('imgSrc').split('/')
      var imgPart = Loader
      for(var i=0;i<imgPath.length;i++){
         imgPart = imgPart[imgPath[i]]
      }
      var img = $(imgPart).clone()
      var parent = $(imgSpan.parentNode)
      img = parent.insertBefore(img, imgSpan)
      parent.removeChild(imgSpan)
      if(imgSpan.getAttribute('imgId')) img.id = imgSpan.getAttribute('imgId')
      if(imgSpan.getAttribute('hidden')=="true") img.setStyle({ "display" : 'none'});
      if (classes) {
	      for (var i = 0; i < classes.length; i++) {
		      img.addClassName(classes[i])
	      }
      }
	  var style = imgSpan.getAttribute('imgStyle')
	  if(style)img.setAttribute('style',style)
    })
  }

});


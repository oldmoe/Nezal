var Text = {}

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
  creepFactory : null,
  quarryFactory : null,
  lumbermillFactory : null,
  neighborGame : null,
  mouseStartEvent : null,
  mouseEndEvent : null,
  mouseClickEvent : null,
  mouseMoveEvent : null,
  zoomFactor : 1,
  persistentObjects : [],
  reInitializationNotifications : [],
  resources : {
    rock : 0,
    lumber : 0
  },
  workersStatus : null,
  research : null,

  initialize : function(){
    this.network = new Network(); 
  	if(!this.isTouchDevice()){
  		this.mouseClickEvent = 'click'
  		this.mouseStartEvent = 'mousedown'
  		this.mouseEndEvent = 'mouseup'
  		this.mouseMoveEvent = 'mousemove'
  	}else {
  		this.mouseClickEvent = 'touchstart'
  		this.mouseStartEvent = 'touchstart'
  		this.mouseEndEvent = 'touchend'
  		this.mouseMoveEvent = 'touchmove'
    }
    soundManager.mute()
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
    var gameElementsImages = ['upper_bar.png', 'energy_bar_background.png','monitor.png','background.png','zone2.png','cancel.png','button.png',
                              'zoom.png','hover.png','sound.png','music.png','control_button.png','click.png','move.png','flag.png',
                            	'panel_background.png', 'resource_meter_background.png','resource_meter_rock.png','resource_meter_wood.png',
                            	'button_clicked.png', 'building_menu_hover.png', 'build_button.png','language_button.png','language_click.png',
                              'map_button.png','map_button.png']
                              
    var globalMapImages = ['borders_compass.png','arrows.png','buttons.png','friend_user.png','list_button.png','normal_user.png','panel_background.png',
    'user_map.png', 'me.png', 'ai.png']           
                   
    var friendsImages = ['1st_blank.png', 'bar.png', 'home_icon.png']
    var buildingImages = ['townhall.png']
    var panelImages = ['buttons.png']
    var questsImages = [  "msgBg.png", "wedge.png", "button.png", "msgBaloon.png", "questBaloon.png" , "questBg.png", "buildingPanelBg.png",
                          "resources.png", "correct.png", "buildingsBg.png", "wedgesBg.png", 
                          'button.png','cursor.png',"social.png", "civil.png", "military.png", "circles.png", "hover.png", "animated_circles.gif", 
                          "line.png", "resources_needed_for_building.png", "building_hover.png", "building_hover_arrow.png", "empty.png",
                          "cancel_in_progress.png"];
    questsImages = questsImages.concat(BuildingMode.prototype.buildings.collect(function(building){
                                                                      return building + "_info.png";
                                                                  }));
    questsImages = questsImages.concat(BuildingMode.prototype.buildings.collect(function(building){
                                                                      return building + "_info_dimmed.png";
                                                                  }));
    rewardsImages = ['reward_notification.png', 'gold_bag.png', 'background.png', 'gold_bag_button.png',
                     'rock_bag.png', 'rock_bag_button.png', 'lumber_bag.png', 'lumber_bag_button.png', 'mix_bag.png', 'mix_bag_button.png'];
    var specialDefaultActionImages = ['assign_worker.png', 'move.png']
    new Loader().load([ {images : gameElementsImages, path: 'images/game_elements/', store: 'game_elements'},
                        {images : friendsImages, path: 'images/friends/', store: 'friends'},
                        {images : questsImages, path: 'images/quests/', store: 'quests'},
                        {images : globalMapImages, path: 'images/global_map/', store: 'globalMap'},
                        {images : panelImages, path: 'images/buildings/panel/', store: 'panel'},
                        {images : buildingImages, path: 'images/buildings/', store: 'buildings'},
                        {images : specialDefaultActionImages, path: 'images/buildings/special_default_actions/', store: 'default_actions'},
                        {images : rewardsImages, path : 'images/rewards/', store : 'rewards'}
                      ],
                      {
                        onProgress : function(progress){
                          if($$('#inProgress #loadingBarFill')[0])
                          $$('#inProgress #loadingBarFill')[0].style.width = Math.min(progress,88)+"%"
                        },
                        onFinish: function(){
                          $('gameContainer').innerHTML = game.templatesManager.load("gameElements");
                          self.addLoadedImagesToDiv('gameContainer')
                          Map.initializeMapSize()
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
        self.network.neighbourIDs( function(friendIDs){
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
            friendsCarousel = new Carousel("friends", images, 6);
            friendsCarousel.checkButtons();
          });
        });
        
        //////////////////////////////////
        self.reInitialize();
        //Sounds.gameSounds.Intro[0].stop()
        //Sounds.resumeTrack()
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
    buildingImages.push("defense_research_animation.png");
    buildingImages.push("military_research_animation.png");
    buildingImages.push("garage_action.png")
    buildingImages.push("garage_action.png")
  
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
		
    var creepsImages = ["car.png",'explosion.png','car_fight.png','axe.png','axe_fight.png']
    var creepsMenuImages = ['car_button.png','car_button_disabled.png','axe_button.png','axe_button_disabled.png',
    'cancel.png', 'filling_bar.png', 'background_bar.png']
		//This is duplicated to avoid a problem in the loader that can't deal with an array of a single item
    var smokeImages = ["smoke_big.png", "smoke_big.png"]
    
    //var invasionImages = ['down_left.png','down_right.png','up_left.png','up_right.png']
    var researchImages = ["cement.png", "cement_disabled.png", "laser.png", "laser_disabled.png",
                         'blue_bubble.png', 'red_bubble.png', 'green_bubble.png', 'yellow_bubble.png', 'white_bubble.png'];
    var creepGenerationImages = ["",""]
  
    // Weapons Images 
		var weaponsImages = ["slingshot.png", "rock.png", "green_book.png"]
    new Loader().load([{images : BaseDefenderScene.prototype.textures, path: 'images/textures/', store: 'textures'},
                       {images : buildingImages, path: 'images/buildings/', store: 'buildings'},
											 {images : buildingModeImages, path: 'images/buildings/', store: 'buildingModes'},
											 {images : iconsImages, path: 'images/icons/', store: 'icons'},
										 	 {images : workerImages, path: 'images/worker/', store: 'worker'},
											 {images : creepsImages, path: 'images/creeps/', store: 'creeps'},
                       {images : creepsMenuImages, path: 'images/creeps/menu/', store: 'creeps'},
                       {images : smokeImages, path: 'images/', store: 'smoke'},
											 {images : buildingOutlineImages, path: 'images/buildings/outlines/', store: 'buildingOutlines'},
											 {images : buildingShadowImages, path: 'images/buildings/shadows/', store: 'buildingShadows'},
											 {images : buildingMovingImages, path: 'images/buildings/moving/', store: 'buildingMoving'},
											 {images : weaponsImages, path: 'images/weapons/', store: 'weapons'},
                       {images : researchImages, path: 'images/researches/', store: 'researches'}],
      {onFinish : loaderFinishCallback});
  },
  
  reInitialize : function(callback){
    this.neighborGame = false;
  	$('home').hide();
    var self = this;
    this.network.initializeGame( function(gameStatus){
      self.gameStatus = gameStatus;
      self.data = gameStatus.game_data.metadata;
    
      Language.getLanguage(gameStatus.user_data.locale, function() {
        var language = Language.userLanguage;
        $('gameContainer').addClassName(language);
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
      self.addPersistentObjects()
      if(callback) callback();
    } );
  },
  addPersistentObjects : function(){
    this.persistentObjects.each(function(obj){
      game[obj.factory+"Factory"].registery.push(obj.obj)
		  game.scene.push(obj.obj)
      var displayClass = eval(obj.type+"Display")
		  var display = new displayClass(obj.obj)
  		game.scene.pushAnimation(display)
    })
  },
  updateGameData : function(){
     this.neighborGame = false;
  	$('home').hide();
    var self = this;
    this.network.initializeGame( function(gameStatus){
      self.gameStatus = gameStatus;
      self.data = gameStatus.game_data.metadata;
    
      Language.getLanguage(gameStatus.user_data.locale, function() {
        var language = Language.userLanguage;
        $('gameContainer').addClassName(language);
        if(!Language[language])
        {
          self.network.fetchTemplate( "statics/" + language + ".html", function(responseText){
            Language[language] = responseText;
            Text = JSON.parse(responseText);
            self.scene.render();
          });
        }else{
          self.scene.render();
        }
      });
      if(callback) callback();
    } );
  },
  selectLanguage : function(lang){
    if(!$$('#controlPanel #languages')[0].hasClassName('opened'))return
    var self = this;
    this.questsManager.hideQuests();
    this.buildingsManager.hideBuildControls();
    Language.select(lang, function(){
      var language = Language.userLanguage;
      for(var i=0; i<Language.langsNames.length; i++) 
      {      
        $('gameContainer').removeClassName(Language.langsNames[i][0]);
      }
     
      $('gameContainer').addClassName(language);
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
    if(!this.reactor){
      this.reactor = new Reactor(80);
      this.reactor.run();
    } 
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
    this.workerFactory = new WorkerFactory(this);
    this.creepFactory = new CreepFactory(this);
    this.defenseCenterFactory = new DefenseCenterFactory(this);
    this.warFactoryFactory = new WarFactoryFactory(this);
    this.houseFactory = new HouseFactory(this);
    this.workerPanel = new WorkerPanel();
	  this.palmFactory = new PalmFactory(this);
	  this.garageFactory = new GarageFactory(this);
	  this.defenseResearchFactory = new DefenseResearchFactory(this);
	  this.militaryResearchFactory = new MilitaryResearchFactory(this);
    this.wedgeFactory = new WedgeFactory(this);
    this.gaddafiFactory = new GaddafiFactory(this);
    if(!this.globalMapManager)this.globalMapManager  = new GlobalMapManager(this);
    this.invadeDisplay = new InvadeDisplay(this);
    this.protectionDisplay = new ProtectionDisplay(this)
    if(!this.attackIterfaceManager)this.attackIterfaceManager = new AttackIterfaceManager(this)
    if( !this.buildingMode )
      this.buildingMode = new BuildingMode(this);
    else{
      var selectedBuilding = this.buildingMode.selectedBuilding;
      if( selectedBuilding && selectedBuilding.state == selectedBuilding.states.NOT_PLACED ){
        
        var newBuilding = this[selectedBuilding.name.dasherize().camelize() + 'Factory'].newBuilding();
        this.buildingMode.on( newBuilding, function(){} );
      }
    }
    
    this.controlsPanel = new ControlsPanel(this);
    if(this.neighborGame != true) {
      this.buildingsManager = new BuildingsManager(this);
      this.questsManager = new QuestsManager(this);
      this.tutorial = new Tutorial(this);
      this.tutorial.fire();
    
    }
    this.rewardsPanel = new RewardsPanel(this)
    this.rewardsPanel.handleRewards();
    
    this.energy = new Energy(this);
    new EnergyDisplay(this);
    this.research = new Research(this);
    this.creepPanel = new CreepPanel(this)
    this.garagePanel = new GaragePanel(this)
    this.reInitializationNotifications.each(function(fn){fn()});
  },
  
  loadUserEmpire : function(user_id,callback){
  	$('home').show();
    var self = this;
    this.originalUserData = this.user.data
    this.network.neighbourEmpire(user_id, function(userData){
      self.gameStatus.user_data = userData;
      self.neighborGame = true;
      self.visitedNeighborId = user_id;
      self.collectedRewardBags = 0;
      self.updateGameStatus( self.gameStatus );
      self.scene.adjustNeighborScene();
      if(callback)callback()
    });
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
	  if(style) img.setAttribute('style',style)
    })
  }

});

function makeUnselectable(node) {
    if (node.nodeType == 1) {
        node.unselectable = true;
    }
    var child = node.firstChild;
    while (child) {
        makeUnselectable(child);
        child = child.nextSibling;
    }
}


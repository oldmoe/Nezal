var Display = Class.create({
  xdim :0,
	ydim :0,
	zdim :0,
	imgWidth :0,
	imgHeight :0,
	moving : false,
	rotating : false,
	targetAngle : 0,
	angle : 0,
	sprites : null,
	initialize : function(owner,properties){
		Object.extend(this,properties)
		this.sprites = {}
		this.owner = owner
	},
	 collides : function(u){
		return Util.collision(this,u)
	 },
	 distance : function(u){
		return Math.sqrt(Math.pow(u.x-this.x,2)+Math.pow(u.y-this.y,2))
	 },
	 getNextMove : function(){
		if(this.x!=this.goalX || this.y!=this.goalY){
			var movement = Util.getNextMove(this.x,this.y,this.goalX,this.goalY,this.speed)
		}
	 }
});

var BuildingDisplay = Class.create(Display, {
  initialize : function($super,owner,properties){
		$super(owner,properties)
		this.noOfXTiles = Math.ceil(this.xdim / Map.tileIsoLength)
		this.noOfYTiles = Math.ceil(this.ydim / Map.tileIsoLength)
		this.owner = owner
		this.img = Loader.images.buildings[this.owner.name+'.png'];
		var buildImgName = this.noOfXTiles+"x"+this.noOfYTiles
		this.invalidImg =  Loader.images.buildingModes[buildImgName+"_invalid.png"];
		this.baseImg = Loader.images.buildingModes[buildImgName+'_base.png'];
		this.outlineImg = Loader.images.buildingOutlines[this.owner.name+"_outline.png"];
		this.mapTiles =[];
		Object.extend(this.owner,this); 
		this.sprites.base = new DomSprite(owner,this.baseImg,null,{shiftY: this.zdim});
		this.sprites.invalid = new DomSprite(owner,this.invalidImg,null,{shiftY: this.zdim});
		this.sprites.outline = new DomSprite(owner,this.outlineImg);
		this.sprites.building = new DomSprite(owner,this.img,null,{clickable:true});
		this.render();
    this.manageStateChange();
	},
	
  manageStateChange : function(){
    var self = this;
    this.owner.stateNotifications[this.owner.states.NOT_PLACED].push(function(){
      self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = false;
			self.sprites.base.show();
			self.sprites.outline.hide()
			self.sprites.invalid.hide();
    });
    this.owner.stateNotifications[this.owner.states.UNDER_CONSTRUCTION].push(function(){
      var top =  self.owner.coords.y -Math.round(self.imgHeight/2)
      var left =  self.owner.coords.x -Math.round(self.imgWidth/2);
      self.progressDisplay = new ProgressDisplay( self.owner.nextLevelBluePrints.time, top, left, self.owner.coords.y );
      self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = false;
			self.sprites.base.hide();
			self.sprites.outline.hide()
			self.sprites.invalid.hide();
    });
    this.owner.stateNotifications[this.owner.states.UPGRADING].push(function(){
      self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = false;
			self.sprites.base.hide();
			self.sprites.outline.hide()
			self.sprites.invalid.hide();
    });
    this.owner.stateNotifications[this.owner.states.NORMAL].push(function(){
      self.sprites.building.setOpacity(1);
      self.sprites.building.animated = true;
			self.sprites.base.hide();
			self.sprites.outline.hide()
			self.sprites.invalid.hide();
    });
  },
	
	render : function(){
    if (this.owner.state == this.owner.states.UNDER_CONSTRUCTION) {
      this.progressDisplay.render( this.owner.elapsedTime() );
    } else if (this.owner.state == this.owner.states.NOT_PLACED) {
			if( this.owner.locationValid ){
				this.sprites.invalid.hide();
			}else{
				this.sprites.invalid.show();
			}
    }
		
		
		for(var sprite in this.sprites){
			this.sprites[sprite].render();
		}
	},
	
	destroy : function(){
		for(var sprite in this.sprites){
			this.sprites[sprite].destroy();
		}
	}
	
});

var TownhallDisplay = Class.create(BuildingDisplay, {
		frameDuration : 4,
		frameDurationCounter : 2,
		
		renderPanel : function(){
	    var self = this.owner;
	    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){
	      return self.game.templatesManager.townhallPanel(self.name, self.inProgress(), self.game.workerFactory.nextWorkerCost());
	    });
	    self.game.workerFactory.attachHireTrigger();
	    this._AttachNewBuildingsTriggers();
	  },
		
		_AttachNewBuildingsTriggers : function(){
	    var thisGame = this.game;
	    if ($$('.building-functions').any()) {
	      $('build-quarry').observe('click', function(){
	        thisGame.buildingMode.on(thisGame.quarryFactory.newQuarry(), function(){});
	      });
	      $('build-lumbermill').observe('click', function(){
	        thisGame.buildingMode.on(thisGame.lumbermillFactory.newLumbermill(), function(){});
	      });
	      
	    }
	  },
		
		render : function($super){
      $super();
			if (!this.sprites.building.animated) {
        this.sprites.building.currentAnimationFrame = 0
      }
      else {
        this.frameDurationCounter = (this.frameDurationCounter + 1) % (this.frameDuration + 1);
        if (this.frameDuration == this.frameDurationCounter) {
          this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame + 1) % this.sprites.building.noOfAnimationFrames;
        }
      }
		}
});

var ResourceBuildingDisplay = Class.create(BuildingDisplay, {
	renderPanel : function(){
    var self = this.owner;
		console.log("rendering resource building panel")
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){
			console.log(self);
			console.log(self.game.templatesManager.resourceBuildingPanel(self));
      return self.game.templatesManager.resourceBuildingPanel(self);
    });
    this._AttachAssignTrigger();
  },
	
	_AttachAssignTrigger: function(){
    var self = this.owner;
    if($$('.building-functions').any()){
      var trigger = $('assign_worker_trigger');
    
      trigger.observe('click', function(){
        self._AssignWorker();
      });
    }
  }
});

var LumbermillDisplay = Class.create(ResourceBuildingDisplay, {
  
});

var QuarryDisplay = Class.create(ResourceBuildingDisplay, {
  
});

var BuildingPanelDisplay = Class.create({
  initialize : function(game){
		console.log("Pushing Notification");
		console.log(game.reInitializationNotifications.size());
		game.reInitializationNotifications.push(function(){
			console.log("Notification Fired");
			if (game.selectedBuildingPanel && game.selectedBuildingPanel.selectedBuilding) {
				console.log("Notification Fired Successfully");
		  	game.selectedBuildingPanel.selectedBuilding.renderPanel();
		  }
		});
	}
});

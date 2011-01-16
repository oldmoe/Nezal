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
	 },
	 destroy : function(){
		for(var sprite in this.sprites){
			this.sprites[sprite].destroy();
		}
	}
});

var WorkerDisplay = Class.create(Display,{
	imgWidth : 64,
	imgHeight : 93,
	xdim : 64,
	ydim : 93,
	zdim : 0,
	initialize: function($super, owner, properties){
  	$super(owner, properties);
		this.noOfXTiles = Math.ceil(this.xdim / Map.tileIsoLength);
		this.noOfYTiles = Math.ceil(this.ydim / Map.tileIsoLength);
		this.owner = owner;
		this.img = Loader.images.worker['worker.png'];
		this.shadowImg = Loader.images.worker['worker_shadow.png'];
		Object.extend(this.owner,this);
		this.sprites.worker = new DomImgSprite(owner, {img : this.img});
		this.sprites.shadow = new DomImgSprite(owner.shadow, {img : this.shadowImg}, {shiftY: 48, shiftX: 10});
  },
	render : function(){
		this.sprites.worker.render();
	//	this.sprites.shadow.render();
		var divider = 20;
		if (this.owner.angle == Map.S) divider = 45;
		var scale = Math.abs(this.sprites.shadow.owner.coords.y-this.sprites.worker.owner.coords.y)/divider + 1;
		this.sprites.shadow.setImgWidth(scale*this.shadowImg.width)
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
    this.mouseoverImg = Loader.images.icons[this.owner.name+"_icon.png"];
		this.transparentImg = Loader.images.buildingModes["transparent.png"];
		this.mapTiles =[];
		Object.extend(this.owner,this); 
		this.sprites.base = new DomImgSprite(owner, {img : this.baseImg}, {shiftY: this.zdim});
		this.sprites.invalid = new DomImgSprite(owner, {img : this.invalidImg}, {shiftY: this.zdim});
		this.sprites.outline = new DomImgSprite(owner, {img: this.outlineImg});
    this.sprites.info = new DomTextSprite(owner, {text : owner.textInfo()}, {centered: true, shiftY: -10});
		this.sprites.building = new DomImgSprite(owner, {img: this.img} );
    this.sprites.mouseover = new DomImgSprite(owner, {img: this.mouseoverImg});
		this.sprites.clickSprite = new DomImgSprite(owner,{img : this.transparentImg, area:this.area}, {clickable: true});
		this.sprites.clickSprite.img.setStyle({width:this.imgWidth+"px",height:this.imgHeight+"px"})	
		this.render();
    this.manageStateChange();
	},
	
  manageStateChange : function(){
    var self = this;
    this.owner.stateNotifications[this.owner.states.NOT_PLACED].push(function(){
      self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = false;
			self.sprites.base.show();
			self.sprites.outline.hide();
      self.sprites.info.hide();
      self.sprites.mouseover.hide();
			self.sprites.invalid.hide();
    });
    this.owner.stateNotifications[this.owner.states.UNDER_CONSTRUCTION].push(function(){
      var top =  self.owner.coords.y -Math.round(self.imgHeight/2)
      var left =  self.owner.coords.x -Math.round(self.imgWidth/2);
      self.progressDisplay = new ProgressDisplay( self.owner.nextLevelBluePrints.time, top, left, self.owner.coords.y );
      self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = false;
			self.sprites.base.hide();
			self.sprites.outline.hide();
      self.sprites.info.hide();
      self.sprites.mouseover.hide();
			self.sprites.invalid.hide();
    });
    this.owner.stateNotifications[this.owner.states.UPGRADING].push(function(){
      self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = false;
			self.sprites.base.hide();
			self.sprites.outline.hide();
      self.sprites.info.hide();
      self.sprites.mouseover.hide();
			self.sprites.invalid.hide();
    });
    this.owner.stateNotifications[this.owner.states.NORMAL].push(function(){
      self.sprites.building.setOpacity(1);
      self.sprites.building.animated = true;
			self.sprites.base.hide();
			self.sprites.outline.hide();
      self.sprites.info.hide();
      self.sprites.mouseover.hide();
			self.sprites.invalid.hide();
    });
  },
	
  renderPanel : function(){
    $('building-panel').setStyle({
      top: this.owner.coords.y - Map.y - Math.round(this.owner.imgHeight / 2) + "px",
      left: this.owner.coords.x - Map.x + Math.round(this.owner.imgWidth / 2) + "px"
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
		animationRepeats : 2,
		animationEverySeconds : 4,
		tickDelay : 4,
		initialize : function($super,owner,properties){
			$super(owner,properties)
			var self = this;
			this.owner.game.scene.pushPeriodicalRenderLoop(
							this.tickDelay,
							this.animationRepeats * this.sprites.building.noOfAnimationFrames,
							this.animationEverySeconds,
							function(){self.renderAnimation()})
		},
		
		renderPanel : function($super){
      $super();
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
		
		renderAnimation : function(){
			if (!this.sprites.building.animated) {
        this.sprites.building.currentAnimationFrame = 0
      }
      else {
		  	this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame + 1) % this.sprites.building.noOfAnimationFrames;
      }
		}
});

var ResourceBuildingDisplay = Class.create(BuildingDisplay, {
	renderPanel : function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){
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
  numberOfBubbles : 3,
  bubbles : null,
  bubbleImg : null,
  bubbleElevation : null,
  bubbleXMovementLimit : 15,
  bubbleSmallSizeLimit : 5,
  bubbleLargeSizeLimit : 23,
  bubbleInitialXShift : 65,
  initialize : function($super,owner,properties){
		var self = this;
    this.bubbles = [];
    this.bubbleImg = Loader.images.smoke["smoke_big.png"];
    this.bubbleElevation = 60;
    
    for (var i = 0; i < this.numberOfBubbles; i++) {
      
      var bubbleSprite = new DomImgSprite(new Bubble(owner.coords, this.bubbleLargeSizeLimit), {img : this.bubbleImg}, {
        shiftY: 0,
        shiftX: this.bubbleInitialXShift
      });
      bubbleSprite.owner.yMovement = i*this.bubbleElevation /(this.numberOfBubbles);
      bubbleSprite.owner.xMovement = this.bubbleInitialXShift;
			bubbleSprite.setImgWidth(10);
      this.bubbles.push(bubbleSprite);
    }
		    $super(owner,properties);
  },
  
  render : function($super){
    $super();
		if (this.owner.state == this.owner.states.NORMAL) {
			var self = this;
			this.bubbles.each(function(bubble){
				bubble.owner.yMovement -= 0.5;
				bubble.shiftY = bubble.owner.yMovement - 25;
				if (bubble.owner.yMovement < -self.bubbleElevation) {
					bubble.owner.reset();
					bubble.owner.xMovement = self.bubbleInitialXShift;
					bubble.setImgWidth(10);
					return;
				}
				
				var sizeDirection = 1;
				for(var i=0;i<self.bubbleElevation/3;i++){
					if (-bubble.owner.yMovement == (i+1)*3) {
						bubble.shiftX = bubble.owner.xMovement-i*3/2;
						bubble.img.setOpacity(1 + bubble.owner.yMovement/self.bubbleElevation);
						bubble.setImgWidth((i+1)*3 + 10);
		  		}
				}
				bubble.render();
			})
		}
  }
});


var BuildingPanelDisplay = Class.create({
  initialize : function(game){
		game.reInitializationNotifications.push(function(){
			if (game.selectedBuildingPanel && game.selectedBuildingPanel.selectedBuilding) {
		  	game.selectedBuildingPanel.selectedBuilding.renderPanel();
		  }
		});
	}
});

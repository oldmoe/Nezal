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

var WorkerDisplay = Class.create(Display,{
	imgWidth : 64,
	imgHeight : 93,
	xdim : 64,
	ydim : 93,
	zdim : 0,
	initialize: function($super, owner, properties){
  	$super(owner, properties)
		this.noOfXTiles = Math.ceil(this.xdim / Map.tileIsoLength)
		this.noOfYTiles = Math.ceil(this.ydim / Map.tileIsoLength)
		this.owner = owner
		this.img = Loader.images.worker['worker.png'];
		Object.extend(this.owner,this);
		this.sprites.worker = new DomSprite(owner,this.img);
  },
	render : function(){
		this.sprites.worker.render()
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
	renderPanel : function(){
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
  numberOfBubbles : 12,
  bubbles : null,
  bubbleImg : null,
  bubbleElevation : null,
  bubbleXMovementLimit : 15,
  bubbleSmallSizeLimit : 5,
  bubbleLargeSizeLimit : 23,
  
  initialize : function($super,owner,properties){
    var self = this;
    this.bubbles = [];
    this.bubbleImg = Loader.images.bubble["bubble.png"];
    this.bubbleElevation = 70;
    
    for (var i = 0; i < this.numberOfBubbles; i++) {
      
      var bubbleSprite = new DomSprite(new Bubble(owner.coords, this.bubbleLargeSizeLimit), this.bubbleImg, null, {
        shiftY: 0,
        shiftX: 0
      });
      
      bubbleSprite.setImgWidth(this.bubbleSmallSizeLimit);
      bubbleSprite.owner.yMovement = i*this.bubbleElevation / this.numberOfBubbles;
      bubbleSprite.owner.xMovement = 10;
      this.bubbles.push(bubbleSprite);
    }
    $super(owner,properties);
  },
  
  render : function($super){
    $super();
    var self = this;
    this.bubbles.each(function(bubble){
      var bubbleSizeScale = Math.round(Math.random());
      var bubbleXShift = 2;
      
      bubble.owner.yMovement -= 1;
      bubble.shiftY = bubble.owner.yMovement - 30;
      
      if( -bubble.owner.xMovement > self.bubbleXMovementLimit ) {
        bubble.owner.xDirection *= -1;
        bubble.owner.xMovement += 2;
      } else if( bubble.owner.xMovement > self.bubbleXMovementLimit  ) {
        bubble.owner.xDirection *= -1;
        bubble.owner.xMovement -= 2;
      } else {
        bubble.owner.xMovement += bubble.owner.xDirection* bubbleXShift;
      }
      bubble.shiftX = bubble.owner.xMovement;
      
      //Bubble max elevation reached, reseting it
      if( bubble.owner.yMovement < -self.bubbleElevation ) {
        bubble.owner.reset();
        return;
      }
      
      //Bubble is on its half way
      var sizeDirection = 1;
      if( -bubble.owner.yMovement < self.bubbleElevation/1.5 ){
        if (self.bubbleLargeSizeLimit > bubble.owner.size) {
            bubble.owner.size += bubbleSizeScale;
            bubble.setImgWidth( bubble.owner.size);
        }
      //Bubble is on its last half way
      } else {
        if (self.bubbleSmallSizeLimit < bubble.owner.size) {
            bubble.owner.size -= bubbleSizeScale;
            bubble.setImgWidth( bubble.owner.size );
        }
      }
      bubble.render();
    })
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

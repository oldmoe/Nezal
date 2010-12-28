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
  animated : true,
	initialize : function(owner,properties){
		Object.extend(this,properties)
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
		this.owner = owner
		this.img = Loader.images.buildings[this.owner.name+'.png'];
		this.invalidImg =  Loader.images.buildings[this.owner.name+'_invalid.png'];
		this.mapTiles =[];
		Object.extend(this.owner,this);
		this.sprite = owner.sprite = new DomSprite(owner,this.img);
    //this.invalideBuildingSprite = new DomSprite(owner,this.img);
		this.render();
    this.manageStateChange();
	},
	
  manageStateChange : function(){
    var self = this;
    this.owner.stateNotifications[this.owner.states.NOT_PLACED].push(function(){
      self.sprite.setOpacity(0.5);
      self.sprite.animated = false;
    });
    this.owner.stateNotifications[this.owner.states.UNDER_CONSTRUCTION].push(function(){
      var neededTime = self.owner.nextLevelBluePrints.time;
      var elapsed = self.owner.elapsedTime();
      self.progressDisplay = new ProgressDisplay(neededTime, elapsed);
      self.sprite.setOpacity(0.5);
      self.sprite.animated = false
    });
    this.owner.stateNotifications[this.owner.states.UPGRADING].push(function(){
      self.sprite.setOpacity(0.5);
      self.sprite.animated = false
    });
    this.owner.stateNotifications[this.owner.states.NORMAL].push(function(){
      self.sprite.setOpacity(1);
      self.sprite.animated = true
    });
  },
  	
	render : function(){
    if (this.owner.state == this.owner.states.UNDER_CONSTRUCTION) {
      this.progressDisplay.elapsed = this.owner.elapsedTime();
      this.progressDisplay.render();
    }
		this.sprite.render();
	},
	
	destroy : function(){
		console.log(this)
		this.sprite.destroy()
	}
	
});

var TownhallDisplay = Class.create(BuildingDisplay, {
		frameDuration : 4,
		frameDurationCounter : 2,
		render : function($super){
      $super();
			if (!this.sprite.animated) {
        this.sprite.currentAnimationFrame = 0
      }
      else {
        this.frameDurationCounter = (this.frameDurationCounter + 1) % (this.frameDuration + 1);
        if (this.frameDuration == this.frameDurationCounter) {
          this.sprite.currentAnimationFrame = (this.sprite.currentAnimationFrame + 1) % this.sprite.noOfAnimationFrames;
        }
      }
		}
});

var MineDisplay = Class.create(BuildingDisplay, {
  
});

var QuarryDisplay = Class.create(BuildingDisplay, {
  
});
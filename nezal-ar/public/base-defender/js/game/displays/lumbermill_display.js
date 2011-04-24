var LumbermillDisplay = Class.create(ResourceBuildingDisplay, {
    animationRepeats : 2,
    animationEverySeconds : 4,
    tickDelay : 3,
    sawAnimationCounter : 0,
    
  initialize : function($super,owner,properties){
    $super(owner,properties)
    var self = this;
    this.owner.game.scene.pushPeriodicalRenderLoop(
            this.tickDelay,
            this.animationRepeats * this.sprites.building.noOfAnimationFrames,
            this.animationEverySeconds,
            function(){self.renderAnimation()})
		this.sprites.resourceMeter = new DomResourceMeter(this.owner, {
			meterFunc: function(){
				return self.owner.getResourceMeterLength()
			},
			styleClass:{empty:'resourceEmpty',full:'resourceFull'},
			shiftX: this.owner.imgWidth / 2,
			shiftY: 28,
			height : 60,
			emptyImg : Loader.images.game_elements['resource_meter_background.png'],
			fullImg : Loader.images.game_elements['resource_meter_wood.png']
		})
	this.sprites.attention.shiftY = -15;
	this.sprites.clickSprite.shiftX = 18
	this.sprites.clickSprite.shiftY = 22
	this.sprites.clickSprite.setImgWidth(108)
	this.sprites.clickSprite.setImgHeight(82)
  },
    
  createSprites : function($super){
    $super();
  	this.sawImg = Loader.images.buildings['lumbermill_saw.png'];
    this.sprites.saw = new DomImgSprite(this.owner, {img: this.sawImg});
  },
   manageStateChange : function($super){
    $super()
    var self = this;
    this.owner.stateNotifications[this.owner.states.NOT_PLACED].push(function(){
      self.sprites.saw.hide()
    });
    this.owner.stateNotifications[this.owner.states.UNDER_CONSTRUCTION].push(function(){
      self.sprites.saw.show()
    });
    this.owner.stateNotifications[this.owner.states.UPGRADING].push(function(){
      self.sprites.saw.show()
    });
    this.owner.stateNotifications[this.owner.states.NORMAL].push(function(){
      self.sprites.saw.show()
    });
  },

  renderAnimation : function(){
    if (!this.sprites.building.animated) {
      this.sprites.building.currentAnimationFrame = 0
    }
    else {
      this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame + 1) % this.sprites.building.noOfAnimationFrames;
    }
  },
  render : function($super){
    $super();
    if(!this.owner.producing || !this.owner.working || this.owner.hp<=0 || this.owner.assignedWorkers==0)return;
    if (this.owner.state == this.owner.states.NORMAL && this.sawAnimationCounter%2==0) {
        this.sprites.saw.currentAnimationFrame = (this.sprites.saw.currentAnimationFrame + 1) % this.sprites.saw.noOfAnimationFrames;
    }   
    this.sawAnimationCounter = (this.sawAnimationCounter+1)%2; 
  },
  manageStateChange: function($super){
    $super()
  }
});

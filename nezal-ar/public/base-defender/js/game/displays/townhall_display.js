var TownhallDisplay = Class.create(BuildingDisplay, {
  animationRepeats : 2,
  animationEverySeconds : 4,
  tickDelay : 4,
  doorOpening : false,
  doorClosing : false,
  doorFrames : 6,
	flagFrames : 5,
	flagImgWidth : 64,
	flagImgHeight : 93,
	flagZDim : 93,
  initialize : function($super,owner,properties){
    this.defaultAction = this.renderBuildingMenu;
    this.flagImg = Loader.images.game_elements['flag.png'];
    $super(owner,properties);
    this.sprites.base.shiftX = -8;
    this.sprites.base.div.style.width = "171px";
    this.sprites.invalid.shiftX = -8;
    this.sprites.invalid.div.style.width = "185px";
    this.sprites.underConstruction.shiftX = -15;
    this.sprites.underConstruction.div.style.width = "196px";
    this.sprites.underConstruction.render();
    var self = this;
    this.owner.game.scene.pushPeriodicalRenderLoop(
            this.tickDelay,
            this.animationRepeats * this.sprites.building.noOfAnimationFrames,
            this.animationEverySeconds,
            function(){self.renderAnimation()});
  },
    
  createSprites : function($super){
    $super()
    this.sprites.flag = new DomImgSprite({
      coords: this.owner.coords,
      imgWidth: this.flagImgWidth,
      imgHeight: this.flagImgHeight,
      zdim: this.flagZDim
    }, {
      img: this.flagImg
    }, {
      shiftY: 22,
      shiftX: 93,
      zIndex: this.owner.coords.y + this.owner.zdim
    })
    this.sprites.health.shiftY = 20;
	  this.sprites.clickSprite.shiftY = 40;
	  this.sprites.clickSprite.shiftX = -10;
	  this.sprites.clickSprite.setImgHeight(135);
  },
    
  renderPanel : function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){
      return self.game.templatesManager.load("townhall-panel", {building : self});
    });
    self.game.workerFactory.attachHireTrigger();
  },
    
  render : function($super){
    $super()
  if(this.owner.game.reactor.ticks %2==0){
  	 this.sprites.flag.currentAnimationFrame = (this.sprites.flag.currentAnimationFrame + 1) % this.flagFrames;
  }
    if(this.owner.producing && this.owner.working  && this.owner.game.reactor.ticks %4==0) this.renderDoor()
  },  
    
  renderDoor : function(){
      if(!this.doorOpening && !this.doorClosing){
        this.sprites.building.animated = false
        this.sprites.building.replaceImg(Loader.images.buildings['townhall_door.png'])
        this.doorOpening = true
        this.sprites.building.currentAnimationFrame = 0
      } 
      if(this.sprites.building.currentAnimationFrame == this.doorFrames-1){
        this.doorOpening = false
        this.doorClosing = true
        if(this.owner.producingCallback)this.owner.producingCallback()
        return
      }
      if(this.sprites.building.currentAnimationFrame == 0 && this.doorClosing){
        this.doorClosing = false
        this.owner.producing = false
        this.sprites.building.replaceImg(Loader.images.buildings['townhall.png'])
        this.sprites.building.animated = true
      }
      else if (this.doorOpening)
      this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame + 1);
      else if (this.doorClosing)
      this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame - 1);
  },
  
  renderAnimation : function(){
    if (!this.sprites.building.animated && !this.owner.producing) {
      this.sprites.building.currentAnimationFrame = 0
    }
    else if(!this.owner.producing){
      this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame + 1) % this.sprites.building.noOfAnimationFrames;
    }
  },
  
  renderBuildingMenu : function(){
    Sounds.play(Sounds.gameSounds.click);
    this.game.buildingsManager.displayBuildingsPanel({'disabled' : []});
  }

});

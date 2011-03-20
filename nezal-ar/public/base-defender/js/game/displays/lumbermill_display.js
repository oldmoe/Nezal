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
  },
    
  createSprites : function(){
    this.sawImg = Loader.images.buildings['lumbermill_saw.png'];
    this.sprites.base = new DomImgSprite(this.owner, {img : this.baseImg}, {shiftY: this.zdim});
    this.sprites.invalid = new DomImgSprite(this.owner, {img : this.invalidImg}, {shiftY: this.zdim});
    this.sprites.shadow = new DomImgSprite(this.owner, {img: this.shadowImg, width:this.shadowImg.width,
                                                        height:this.shadowImg.height});
    this.sprites.outline = new DomImgSprite(this.owner, {img: this.outlineImg});
    this.sprites.health = new DomHealthSprite(this.owner)
    this.sprites.shadow.shiftX = this.imgWidth - this.shadowImg.width
    this.sprites.shadow.shiftY = this.imgHeight - this.shadowImg.height
      this.sprites.info = new DomTextSprite(this.owner, 'textInfo', {centered: true, shiftY: -10});
    this.sprites.building = new DomImgSprite(this.owner, {img: this.img});
    this.sprites.saw = new DomImgSprite(this.owner, {img: this.sawImg});
      this.sprites.mouseover = new DomImgSprite(this.owner, {img: this.mouseoverImg});
    this.sprites.clickSprite = new DomImgSprite(this.owner,{img: this.transparentImg,area:this.area}, {clickable: true});
      this.sprites.clickSprite.img.setStyle({width:this.imgWidth+"px",height:this.imgHeight+"px"})
    //this.sprites.skeleton = new DomSkeleton(this.owner)
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
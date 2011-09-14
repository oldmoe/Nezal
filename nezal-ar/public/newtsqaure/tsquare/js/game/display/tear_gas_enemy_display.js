var TearGasEnemyDisplay = Class.create(EnemyDisplay,{
  imgWidth:80,
  imgHeight:80,
  noOfFrames : 8,
  states : ["hit","normal"],
  hoverIcon: null,
  initialize : function($super,owner){
    this.walkingImg = Loader.images.enemies['amn_markazy_tear_gas_walk.png']
    this.hitImage = Loader.images.enemies['amn_markazy_tear_gas_shooting.png']
    this.imgWidth = this.walkingImg.width
    this.imgHeight = this.walkingImg.height/this.noOfFrames
    this.createHoveringIcon();
    $super(owner)
    this.registerEvents()
  },

  createHoveringIcon: function(){
    this.setHoveringIcon(this.hoveringIcons.march);
  },
  
  registerEvents : function(){
    var self = this
    this.states.each(function(state){
      self.owner.observe(state,function(){
        self[state]();
      })
    })
  },
  
  hit: function(){
    this.sprites.walking.switchAnimation("hit");
  },

  normal: function(){
    this.sprites.walking.switchAnimation("normal")
  },

  createSprites:function(){
    if(this.owner.showHoveringIcon)
    this.sprites.hoverIcon = new DomImgSprite(this.owner,{img:this.hoverIcon, noOfFrames : 1}, {shiftY:-10, shiftX:20})
    this.sprites.walking = new DomImgSprite(this.owner,{img:this.walkingImg, noOfFrames : 8})
    this.sprites.walking.createAnimation({name:'hit',img:this.hitImage, noOfFrames:16})
  },
  
  render : function($super){
      var sprite = this.sprites.walking
          sprite.currentAnimationFrame = sprite.currentAnimationFrame + 1
          if (sprite.currentAnimationFrame.name == "hit" &&
          sprite.currentAnimationFrame == sprite.noOfAnimationFrames -1) {
                this.normal()
                sprite.currentAnimationFrame = 0
          }
      $super()
  }

}) 
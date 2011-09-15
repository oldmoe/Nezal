var AmnMarkazyDisplay = Class.create(EnemyDisplay,{
    
  imgWidth:80,
  imgHeight:80,
  noOfFrames : 8,
  states : ["hit","normal"],
  hoverIcon: null,
  
  initialize : function($super,owner){
    this.blockImg = Loader.images.enemies['amn_markazy_stick_walk.png']
    this.hitImage = Loader.images.enemies['amn_markazy_stick_hit.png']
    this.imgWidth = this.blockImg.width
    this.imgHeight = this.blockImg.height/this.noOfFrames
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
    this.sprites.block.switchAnimation("hit");
    if(this.owner.showHoveringIcon)
      this.switchHoveringIcon(this.hoveringIcons.circle);
  },

  normal: function(){
    this.sprites.block.switchAnimation("normal")
    if(this.owner.showHoveringIcon)
      this.switchHoveringIcon(this.hoveringIcons.march);
  },

  createSprites:function(){
    if(this.owner.showHoveringIcon)
      this.sprites.hoverIcon = new DomImgSprite(this.owner,{img:this.hoverIcon, noOfFrames : 1}, {shiftY:-10, shiftX:20})
    this.sprites.block = new DomImgSprite(this.owner,{img:this.blockImg, noOfFrames : 8}, {flipped:true})
    this.sprites.block.createAnimation({name:'hit',img:this.hitImage, noOfFrames:9},{flipped:true})
  },
  
  render : function($super){
      var sprite = this.sprites.block
      sprite.currentAnimationFrame = (sprite.currentAnimationFrame+1) % sprite.noOfAnimationFrames
    //  console.log(sprite.noOfAnimationFrames)
      //console.log(this.sprites.block.currentAnimationFrame)
      $super()
    //}
  }
  
})

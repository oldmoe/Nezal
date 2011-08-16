var AmnMarkazyDisplay = Class.create(Display,{
  imgWidth:80,
  imgHeight:80,
  noOfFrames : 8,
  initialize : function($super,owner){
    this.blockImg = Loader.images.enemies['block.png']
    this.hitImage = Loader.images.enemies['amn_markazy_hit.png']
    this.imgWidth = this.blockImg.width
    this.imgHeight = this.blockImg.height/this.noOfFrames
    $super(owner)
  },
  createSprites:function(){
    this.sprites.block = new DomImgSprite(this.owner,{img:this.blockImg, noOfFrames : 8})
    this.sprites.block.createAnimation({name:'hit',img:this.hitImage, noOfFrames:9})
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

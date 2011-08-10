var BlockDisplay = Class.create(Display,{
  imgWidth:80,
  imgHeight:80,
  noOfFrames : 8,
  initialize : function($super,owner){
    this.blockImg = Loader.images.enemies['block.png']
    this.imgWidth = this.blockImg.width
    this.imgHeight = this.blockImg.height/this.noOfFrames
    $super(owner)
  },
  createSprites:function(){
    this.sprites.block = new DomImgSprite(this.owner,{img:this.blockImg})
  },
  render : function($super){
      this.sprites.block.currentAnimationFrame = (this.sprites.block.currentAnimationFrame+1) % this.noOfFrames
    //if(this.owner.stateChanged){
      $super()
    //}
  }
})

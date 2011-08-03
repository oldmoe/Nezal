var BlockDisplay = Class.create(Display,{
  imgWidth:80,
  imgHeight:80,
  initialize : function($super,owner){
    this.blockImg = Loader.images.enemies['block.png']
    $super(owner)
  },
  createSprites:function(){
    this.sprites.block = new DomImgSprite(this.owner,{img:this.blockImg})
  },
  render : function($super){
    //if(this.owner.stateChanged){
      $super()
    //}
  }
})

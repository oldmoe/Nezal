var FollowerDisplay = Class.create(Display,{
  noOfFrames : 6,  
  initialize : function($super,owner,properties){
    this.characterImg = Loader.images.characters['follower.png'];
    this.imgWidth = this.characterImg.width/this.noOfFrames
    this.imgHeight = this.characterImg.height
    $super(owner)
  },
  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg})
  },
  render : function($super){
    if(this.owner.stateChanged){
      this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.noOfFrames 
      $super()
    }
  }
  
})

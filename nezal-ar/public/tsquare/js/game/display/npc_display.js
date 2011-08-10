var NpcDisplay = Class.create(Display,{
  noOfFrames : 1,  
  initialize : function($super,owner,properties){
    this.characterImg = Loader.images.characters['npc.png'];
    this.imgWidth = this.characterImg.width/this.noOfFrames
    this.imgHeight = this.characterImg.height
    $super(owner)
  },
  createSprites : function(){
    var flipped = false
    if(this.owner.direction==-1)flipped = true
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg},{flipped:flipped})
  },
  render : function($super){
    if(this.owner.stateChanged){
      this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.noOfFrames 
      $super()
    }
  }
  
})

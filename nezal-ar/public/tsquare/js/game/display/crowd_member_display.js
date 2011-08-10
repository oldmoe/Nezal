var CrowdMemberDisplay = Class.create(Display,{
  noOfFrames : 9,  
  initialize : function($super,owner,properties){
    this.characterImg = Loader.images.characters['crowd_member.png'];
    this.imgWidth = this.characterImg.width
    this.imgHeight = this.characterImg.height/this.noOfFrames
    $super(owner)
    this.sprites.character.currentAnimationFrame = Math.round((Math.random()* this.noOfFrames-1))
    //console.log(this.sprites.character.currentAnimationFrame)
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

var CrowdMemberDisplay = Class.create(Display,{
  
  noOfFrames : 7,  
  
  states : ["normal", "hold", "walk","reverse", "front", "back","run","reverseRun"],
  
  initialize : function($super,owner,properties){
    this.initImages()
    this.imgWidth = this.characterImg.width
    this.imgHeight = this.characterImg.height/this.noOfFrames
    $super(owner)
    this.sprites.character.currentAnimationFrame = Math.round((Math.random()* this.sprites.character.currentAnimation.noOfFrames-1))
    //console.log(this.sprites.character.currentAnimationFrame)
    this.registerEvents()
  },
  registerEvents : function(){
    var self = this
    this.states.each(function(state){
      self.owner.observe(state,function(){
        self.sprites.character.switchAnimation(state)
        self.sprites.character.currentAnimationFrame = Math.round((Math.random()* self.sprites.character.currentAnimation.noOfFrames-1)) 
      })
    })
  },
  initImages : function(){
    this.characterImg = Loader.images.characters['crowd_member.png'];
  },
  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 7})
    this.sprites.character.createAnimation({name:'hold',img:this.holdImg,noOfFrames:1})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'back' ,img:this.backImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:6})
    this.sprites.character.createAnimation({name:'reverse'  ,img:this.walkImg,noOfFrames:8, flipped : true})
    this.sprites.character.createAnimation({name:'reverseRun'  ,img:this.runImg, noOfFrames:6, flipped : true})
  },
  render : function($super){
    if(this.owner.stateChanged){
      if (this.owner.scene.moveBack) {
        this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame - 1)
        if (this.sprites.character.currentAnimationFrame == -1) {
          this.sprites.character.currentAnimationFrame = this.sprites.character.currentAnimation.noOfFrames - 1 
        }
      }else{
        this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.sprites.character.currentAnimation.noOfFrames
      } 
      $super()
    }
  }
  
})

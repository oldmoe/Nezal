var CrowdMemberDisplay = Class.create(Display,{
  noOfFrames : 9,  
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
    this.owner.addObserver("run",function(){
      self.sprites.character.switchAnimation('run')
    })
    this.owner.addObserver("back",function(){
      self.sprites.character.switchAnimation('back')
    })
    this.owner.addObserver("front",function(){
      self.sprites.character.switchAnimation('front')
    })
    this.owner.addObserver("normal",function(){
      self.sprites.character.switchAnimation('normal')
    })
    this.owner.addObserver("reverse",function(){
      self.sprites.character.switchAnimation('reverse')
    })
  },
  initImages : function(){
    this.characterImg = Loader.images.characters['crowd_member.png'];
  },
  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 8})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'back' ,img:this.backImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:7})
    this.sprites.character.createAnimation({name:'reverse'  ,img:this.characterImg,noOfFrames:8, flipped : true})
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

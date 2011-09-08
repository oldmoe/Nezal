var ChargingAmnMarkazyDisplay = Class.create(AmnMarkazyDisplay,{
    
  initialize : function($super,owner){
      $super(owner)
  },
  
  createHoveringIcon: function(){
    this.hoverIcon = Loader.images.icons['lock.png']
  },

  createHoveringIconSprite: function(){
      if(this.owner.showHoveringIcon)
        this.sprites.hoverIcon = new DomImgSprite(this.owner,{img:this.hoverIcon, noOfFrames : 1}, {shiftY:-10, shiftX:20})
  },
  
  switchHoveringIcon: function(){
      this.hoverIcon = Loader.images.icons['circle.png']
      this.destroy();
      this.createSprites();
  }
  

})

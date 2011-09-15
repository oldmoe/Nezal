var ChargingAmnMarkazyDisplay = Class.create(AmnMarkazyDisplay,{
    
  initialize : function($super,owner){
      $super(owner) 
  },
  
  createHoveringIcon: function(){
    this.hoverIcon = Loader.images.hoveringIcons[this.hoveringIcons.hold]
  },

  hit: function(){
    this.sprites.block.switchAnimation("hit");
    this.switchHoveringIcon(this.hoveringIcons.circle);
  },

  normal: function(){
    this.sprites.block.switchAnimation("normal")
    this.switchHoveringIcon(this.hoveringIcons.hold);
  }

})

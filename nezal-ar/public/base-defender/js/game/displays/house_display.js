var HouseDisplay = Class.create(BuildingDisplay, {
    animationRepeats : 2,
    animationEverySeconds : 4,
    tickDelay : 4,
    initialize : function($super,owner,properties){
      $super(owner,properties)
      var self = this;
      this.owner.game.scene.pushPeriodicalRenderLoop(
              this.tickDelay,
              this.animationRepeats * this.sprites.building.noOfAnimationFrames,
              this.animationEverySeconds,
              function(){self.renderAnimation()});
    },
    
    createSprites : function($super){
      $super()
    },
    
    renderPanel : function($super){
      $super();
	  var self = this.owner;
	  self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
    },
      
    render : function($super){
      $super()
    },  
    
    renderAnimation : function(){
      if (!this.sprites.building.animated) {
        this.sprites.building.currentAnimationFrame = 0
      }
      else{
        this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame + 1) % this.sprites.building.noOfAnimationFrames;
      }
    }
});

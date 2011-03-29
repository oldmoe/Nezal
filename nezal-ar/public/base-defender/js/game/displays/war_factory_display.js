var WarFactoryDisplay = Class.create(BuildingDisplay, {
   	animationRepeats : 1,
    animationEverySeconds : 0,
    tickDelay : 2,
    initialize : function($super,owner,properties){
      $super(owner,properties)
      var self = this;
      this.owner.game.scene.pushPeriodicalRenderLoop(
              this.tickDelay,
              this.animationRepeats * this.sprites.building.noOfAnimationFrames,
              this.animationEverySeconds,
              function(){self.renderAnimation()});
    },
  renderPanel: function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
  },
	renderAnimation : function(){
	  if (!this.sprites.building.animated && !this.owner.producing) {
	    this.sprites.building.currentAnimationFrame = 0
	  }
	  else if(!this.owner.producing){
	    this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame + 1) % this.sprites.building.noOfAnimationFrames;
	  }
	}
});
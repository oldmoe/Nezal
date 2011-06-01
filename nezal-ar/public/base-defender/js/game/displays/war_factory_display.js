var WarFactoryDisplay = Class.create(BuildingDisplay, {
   	animationRepeats : 1,
    animationEverySeconds : 0,
    tickDelay : 2,
    initialize : function($super,owner,properties){
      this.defaultAction = this.renderCreepMenu;
      $super(owner,properties)
      var self = this;
      this.owner.game.scene.pushPeriodicalRenderLoop(
              this.tickDelay,
              this.animationRepeats * this.sprites.building.noOfAnimationFrames,
              this.animationEverySeconds,
              function(){self.renderAnimation()});
    },
    
  renderCreepMenu : function(){
    Sounds.play(Sounds.gameSounds.click);
    game.creepPanel.displayPanel(this.owner,{'disabled' : []});
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
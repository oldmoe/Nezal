var GarageDisplay = Class.create(BuildingDisplay, {
  animationRepeats : 1,
  animationEverySeconds : 0,
  tickDelay : 2,
  doorFrames : 8,
  initialize : function($super,owner,properties){
    this.defaultActionName = "Inhabitants"
      this.defaultAction = this.renderGarageMenu;
      $super(owner,properties)
      var self = this;
      this.owner.game.scene.pushPeriodicalRenderLoop(
              this.tickDelay,
              this.animationRepeats * this.sprites.building.noOfAnimationFrames,
              this.animationEverySeconds,
              function(){self.renderAnimation()});
     game.reactor.pushPeriodical(0,1,1, function(){self.renderDoor()});
     for (var sprite in this.sprites){
       this.sprites[sprite].shiftZ =  -50
     }
  },
  
  renderPanel: function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
  },
  renderGarageMenu : function(){
    Sounds.play(Sounds.gameSounds.click);
    game.garagePanel.displayPanel(this.owner,{'disabled' : []});
  },
  renderAnimation : function(){
    if (this.owner.receivingCreep) {
      this.openining = true
    }
    else {
      if (!this.sprites.building.animated) {
        this.sprites.building.currentAnimationFrame = 0
      }
      else 
        if (!this.owner.producing) {
          this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame + 1) % this.sprites.building.noOfAnimationFrames;
        }
    }
	},
  renderDoor : function(){
    if(!this.openining)return 
      if(this.owner.receivingStepsDone==0){
        this.sprites.building.replaceImg(Loader.images.buildings['garage_action.png'])
        this.sprites.building.currentAnimationFrame =0
        var creepDiv = this.owner.receivedCreep.sprites.body.div
        creepDiv.setStyle({height:"83px"})
      }
      //alert(this.owner.receivingStepsDone)
      this.owner.receivingStepsDone++
      if (this.owner.receivingStepsDone < 8) 
        this.sprites.building.currentAnimationFrame++
      else {
        var creepDiv = this.owner.receivedCreep.sprites.body.div
        var divHeight = parseInt(creepDiv.getStyle('height').replace("px", ""))
        if (divHeight > 0) {
            this.owner.receivedCreep.coords.y+=10
            creepDiv.setStyle({
              height: Math.max(divHeight - 10,0) + "px"
            })
        }else{
          this.sprites.building.replaceImg(Loader.images.buildings['garage.png'])
          this.sprites.building.currentAnimationFrame =0
          this.owner.receivingCreep = null
          this.openining = false
        }
      }
      
  }
});

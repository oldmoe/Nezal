var Townhall = Class.create(Building, {
  
  renderPanel : function(){
    var self = this;
    this.game.selectedBuildingPanel = new BuildingPanel(this, function(){
      return self.game.templatesManager.townhallPanel(self.name, self.inProgress(), this.game.workerFactory.nextWorkerCost());
    });
    this.game.workerFactory.attachHireTrigger();
    this._AttachNewBuildingsTriggers();
  },
  
  _AttachNewBuildingsTriggers : function(){
    var thisGame = this.game;
    if ($$('.building-functions').any()) {
      $('build-quarry').observe('click', function(){
        thisGame.buildingMode.on(thisGame.quarryFactory.newQuarry(), function(){});
      });
      $('build-mine').observe('click', function(){
        thisGame.buildingMode.on(thisGame.mineFactory.newMine(), function(){});
      });
      
    }
  }
  
});
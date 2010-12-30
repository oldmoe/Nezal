var ResourceBuildingFactory = Class.create(BuildingFactory, {

  resourcePerMinute : 0,

  initialize : function($super, game){
    $super(game);
    for( var buildingLocation in this.factoryRegistry ){
      var building = this.factoryRegistry[buildingLocation];
			if (building.state == building.states.NORMAL) {
				this.resourcePerMinute += building.unitPerWorkerMinute * building.assignedWorkers;
			}
    }
    //this._CollectResources();
  }
  
//  _CollectResources : function(){
//    var self = this;
//    this.game.reactor.pushPeriodical(2, function(){
//      self.game.resources[self.canBeBuiltOn] += self.resourcePerMinute / 60;
//      self.game.scene.renderGamePanel();
//    });
//  }

});
var QuarryFactory = Class.create(ResourceBuildingFactory, {
  name : "quarry",
  canBeBuiltOn : "grass",
  buildingClass : Quarry,
  factoryRegistry : {},
  rockPerMinute : 0,
  collect : "rock",
  initialize : function($super, game, name){
    $super(game, name);
    this.rockPerMinute = this.resourcePerMinute;
  },
  
  newQuarry : function(){
    return this.newBuilding();
  }
});

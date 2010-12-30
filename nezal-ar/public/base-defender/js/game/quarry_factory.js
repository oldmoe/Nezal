var QuarryFactory = Class.create(ResourceBuildingFactory, {
  name : "quarry",
  canBeBuiltOn : "grass",
  buildingClass : Quarry,
  factoryRegistry : {},
  rockPerMinute : 0,
  collect : "rock",
  initialize : function($super, game){
    $super(game);
    this.rockPerMinute = this.resourcePerMinute;
  },
  
  newQuarry : function(){
    return this.newBuilding();
  }
});
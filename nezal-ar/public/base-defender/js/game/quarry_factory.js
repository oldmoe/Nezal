var QuarryFactory = Class.create(ResourceBuildingFactory, {
  name : "quarry",
  canBeBuiltOn : "rock",
  buildingClass : Quarry,
  factoryRegistry : {},
  rockPerMinute : 0,
  
  initialize : function($super, game){
    $super(game);
    this.rockPerMinute = this.resourcePerMinute;
  },
  
  newQuarry : function(){
    return this.newBuilding();
  }
});
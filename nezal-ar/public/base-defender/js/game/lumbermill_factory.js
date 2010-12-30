var LumbermillFactory = Class.create(ResourceBuildingFactory, {
  name : "lumbermill",
  canBeBuiltOn : "grass",
  buildingClass : Lumbermill,
  factoryRegistry : {},
  lumberPerMinute : 0,
  collect : "lumber",
  initialize : function($super, game){
    $super(game);
    this.lumberPerMinute = this.resourcePerMinute;
  },
  
  newLumbermill : function(){
    return this.newBuilding();
  }
  
});
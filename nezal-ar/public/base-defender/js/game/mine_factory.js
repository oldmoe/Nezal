var MineFactory = Class.create(ResourceBuildingFactory, {
  name : "mine",
  canBeBuiltOn : "grass",
  buildingClass : Mine,
  factoryRegistry : {},
  ironPerMinute : 0,
  
  initialize : function($super, game){
    $super(game);
    this.ironPerMinute = this.resourcePerMinute;
  },
  
  newMine : function(){
    return this.newBuilding();
  }
  
});
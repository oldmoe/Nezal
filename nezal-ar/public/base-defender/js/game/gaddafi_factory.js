var GaddafiFactory = Class.create(BuildingFactory, {
  name : "gaddafi",
  canBeBuiltOn : "grass",
  buildingClass : Wedge,
  factoryRegistry : {},

  initialize : function($super, game){
    $super(game);
  },
  
  newWedge : function(){
    return this.newBuilding();
  }
  
});

var WedgeFactory = Class.create(BuildingFactory, {
  name : "wedge",
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

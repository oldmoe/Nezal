var WedgeFactory = Class.create(BuildingFactory, {
  name : "wedge",
  canBeBuiltOn : "grass",
  buildingClass : Wedge,
  factoryRegistry : {},

  initialize : function($super, game, name){
    $super(game, name);
  },
  
  newWedge : function(){
    return this.newBuilding();
  }
  
});

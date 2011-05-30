var GarageFactory = Class.create(BuildingFactory, {
  name : "garage",
  canBeBuiltOn : "grass",
  buildingClass : Garage,
  factoryRegistry : {}, 
  initialize : function($super, game){
    $super(game);
  },
  
  newGarage : function(){
    return this.newBuilding();
  }
  
});

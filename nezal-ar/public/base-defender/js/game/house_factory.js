var HouseFactory = Class.create(BuildingFactory, {
  name : "house",
  canBeBuiltOn : "grass",
  buildingClass : House,
  factoryRegistry : {}, 
  initialize : function($super, game){
    $super(game);
  },
  
  newHouse : function(){
    return this.newBuilding();
  }
  
});
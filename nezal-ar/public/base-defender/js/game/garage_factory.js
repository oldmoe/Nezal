var GarageFactory = Class.create(BuildingFactory, {
  name : "garage",
  canBeBuiltOn : "grass",
  buildingClass : Garage,
  factoryRegistry : {},
   
  initialize : function($super, game, name){
    $super(game, name);
  },
  addToMap : function(building){
    this.game.scene.map.addElement(building,true);
  },
  newGarage : function(){
    return this.newBuilding();
  }
  
});

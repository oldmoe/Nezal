var PalmFactory = Class.create(BuildingFactory, {
  name : "palm",
  canBeBuiltOn : "grass",
  buildingClass : Palm,
  factoryRegistry : {}, 
  initialize : function($super, game){
    $super(game);
  },
  
  newPalm : function(){
    return this.newBuilding();
  }
  
});
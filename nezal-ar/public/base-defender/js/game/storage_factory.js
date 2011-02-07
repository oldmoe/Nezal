var StorageFactory = Class.create(BuildingFactory, {
  name : "storage",
  canBeBuiltOn : "grass",
  buildingClass : Storage,
  factoryRegistry : {}, 
  initialize : function($super, game){
    $super(game);
  },
  
  newStorage : function(){
    return this.newBuilding();
  }
  
});
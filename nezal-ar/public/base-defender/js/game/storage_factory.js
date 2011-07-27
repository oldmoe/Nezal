var StorageFactory = Class.create(BuildingFactory, {
  name : "storage",
  canBeBuiltOn : "grass",
  buildingClass : Storage,
  factoryRegistry : {}, 
  initialize : function($super, game, name){
    $super(game, name);
  },
  
  newStorage : function(){
    return this.newBuilding();
  }
  
});

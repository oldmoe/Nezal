var WarFactoryFactory = Class.create(BuildingFactory, {
  name : "war_factory",
  canBeBuiltOn : "grass",
  buildingClass : WarFactory,
  factoryRegistry : {}, 
  initialize : function($super, game){
    $super(game);
  },
  
  newWarFactory : function(){
    return this.newBuilding();
  }
  
});
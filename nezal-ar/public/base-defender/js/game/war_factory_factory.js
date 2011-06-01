var WarFactoryFactory = Class.create(BuildingFactory, {
  name : "war_factory",
  canBeBuiltOn : "grass",
  buildingClass : WarFactory,
  factoryRegistry : {}, 
  initialize : function($super, game){
    $super(game);
    for(var key in game.user.data.war_factory){
      var wf = this.factoryRegistry[key]
      wf.queue = game.user.data.war_factory[key].queue
    }
  },
  
  newWarFactory : function(){
    return this.newBuilding();
  }
  
});
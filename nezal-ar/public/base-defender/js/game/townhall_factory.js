var TownhallFactory = Class.create(BuildingFactory, {
  townhall : null,
  name : "townhall",
  canBeBuiltOn : "grass",
  factoryRegistry : {},
  
  initialize : function($super, game){
    $super(game);
    for (var buildingInstanceCoords in this.factoryRegistry) {
      this.townhall = this.factoryRegistry[buildingInstanceCoords];
    }
  },
  
  newTownhall : function(){
    return this.newBuilding();
  },
	getTownhall : function(){
		for (townhall in this.factoryRegistry){
   			return this.factoryRegistry[townhall]			
		}
	}
  
});
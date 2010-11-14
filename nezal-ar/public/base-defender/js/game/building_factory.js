var BuildingFactory = Class.create({
  game : null,
  //This will store the specs and upgrade costs of different building levels
  bluePrints : null,
  maximumNubmer : null,
  newBuildingSpecs : {'level' : 0, 'coords' : {'x' : null, 'y' : null}},
  factoryRegistry : {},
  
  initialize : function(game){
    
    //console.log(this.name);
    
    this.game = game;
    this.bluePrints = this.game.data.buildings[this.name];
    this.maximumNubmer = this.game.data.buildings[this.name].maximum_number;
    
    if( this.game.user.data[this.name] ){
      
      //I know this will loop only once, as we can only have one townhall
      for( var buildingInstanceCoords in game.user.data[this.name] ){
        this.factoryRegistrar( buildingInstanceCoords, new this.buildingClass(this, this.game.user.data[this.name][buildingInstanceCoords]) );
      }
    }
  },
  
  newBuilding : function(){
    return new this.buildingClass(this, this.newBuildingSpecs);
  },
  
  factoryRegistrar : function(coords, building){
    this.factoryRegistry[coords] = building;
    BuildingFactory._GlobalRegistrar(coords, building);
  }
});

/** coords : '00050006' where 0005 is the x position and 0006 is the y position */
BuildingFactory._GlobalRegistrar = function(coords, building){
  BuildingFactory._GlobalRegistry[coords] = building;
}
BuildingFactory.RegistryIterator = function( todo ){
  for( var buildingInstanceCoords in BuildingFactory._GlobalRegistry ){
    todo( BuildingFactory._GlobalRegistry[buildingInstanceCoords] );
  }
}
BuildingFactory._GlobalRegistry = {};
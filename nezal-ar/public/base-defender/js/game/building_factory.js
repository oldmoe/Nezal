var BuildingFactory = Class.create({
  game : null,
  //This will store the specs and upgrade costs of different building levels
  bluePrints : null,
  maximumNubmer : null,
  newBuildingSpecs : {'state' : Building.prototype.states.NOT_PLACED, 'level' : 0, 'coords' : {'x' : null, 'y' : null}},
  buildingClass : null,
	buildingDisplayClass :null,
	
  initialize : function(game){  
    this.buildingClass = eval(this.name.capitalize());
		this.buildingDisplayClass = eval(this.name.capitalize() + "Display");
    this.game = game;
    this.bluePrints = this.game.data.buildings[this.name];
    this.maximumNubmer = this.game.data.buildings[this.name].maximum_number;
    
    if( this.game.user.data[this.name]){
      
      for( var buildingInstanceCoords in game.user.data[this.name]){
				var building = new this.buildingClass(this, this.game.user.data[this.name][buildingInstanceCoords]);
        this.factoryRegistrar( buildingInstanceCoords,building);
				var display = new this.buildingDisplayClass(building, this.bluePrints.display);
        building.init();
				this.game.scene.push(building);
				this.game.scene.map.addElement(building);
				this.game.scene.pushAnimation(display);
      }
    }
  },
  
  newBuilding : function(){
    var building = new this.buildingClass(this, this.newBuildingSpecs);
		this.game.scene.push(building);
		var display = new this.buildingDisplayClass(building, this.bluePrints.display)
    return building.init();		
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
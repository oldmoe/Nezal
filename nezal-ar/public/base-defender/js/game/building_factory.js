var BuildingFactory = Class.create({
  game : null,
  //This will store the specs and upgrade costs of different building levels
  bluePrints : null,
  maximumNubmer : null,
  newBuildingSpecs : {'state' : Building.prototype.states.NOT_PLACED, 'level' : 0, 'coords' : {'x' : null, 'y' : null}},
  buildingClass : null,
  buildingDisplayClass :null,
  noOfBuildings : 0,
  initialize : function(game){  
    this.buildingClass = eval(this.name.dasherize().capitalize().camelize());  
		 //To get the class name: "defense_center-> defense-center -> Defence-center -> DefenceCenter"
		this.buildingDisplayClass = eval(this.name.dasherize().capitalize().camelize() + "Display");
    this.game = game;
    this.bluePrints = this.game.data.buildings[this.name];    
    if( this.game.user.data[this.name]){
      for( var buildingInstanceCoords in game.user.data[this.name]){
	  	this.noOfBuildings++
				var building = new this.buildingClass(this, this.game.user.data[this.name][buildingInstanceCoords]);
        building.id = buildingInstanceCoords;
        this.factoryRegistrar( buildingInstanceCoords,building);
				var display = new this.buildingDisplayClass(building, this.bluePrints['levels'][this.game.user.data[this.name][buildingInstanceCoords]['level']]['display']);
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
		var display = new this.buildingDisplayClass(building, this.bluePrints['levels'][this.newBuildingSpecs['level']].display)
    return building.init();		
  },
  getDependenciesValidations : function(level){
	 var result = [];
	  var buildingDependencies = this.bluePrints.levels[level].dependency.buildings;
	  for(building in buildingDependencies){
	  	 var buildingValidation = {}
		 result.push(buildingValidation)
		 buildingValidation['building'] = building.capitalize()
		 buildingValidation['level'] = buildingDependencies[building]
		 if (!this.game[building.dasherize().camelize() + "Factory"].buildingExists(buildingDependencies[building])) {
		 	buildingValidation['valid'] = false
		 }
		 else {
		 	buildingValidation['valid'] = true
		 }
	  }
    return result;
  },
  buildingExists : function(level){
  	for (key in this.factoryRegistry) {
		  var building = this.factoryRegistry[key]
		  if (building.state == building.states.NORMAL) {
			  if (!level) 
				  return true
			  if (building.level >= level) 
				  return true
		  }
	  }		
	  return false
  },
  	  
  isDependenciesMet : function(level){
    var result = {valid : true, msg : ''};
	  var buildingDependencies = this.bluePrints.levels[level].dependency.buildings
	  for(building in buildingDependencies){
		  if(!this.game[building.dasherize().camelize()+"Factory"].buildingExists(buildingDependencies[building])){
//			  Notification.alert();
        result['valid'] = false;
        result['msg'] = "Cannot build " + this.name + ", you need a "+ this.humanizeString(building) + " level "+ buildingDependencies[building];
			  return result;
		  }
	  }
    return result;
  },

  hasEnoughResources : function(level){
    var result = {valid : true, msg : ''};
	  /**************************Validate Max number of buildings*******************************/
    var limitingBuilding = this.bluePrints.levels[level].limited_by
	  if (limitingBuilding) {
		  var registery = this.game[limitingBuilding.dasherize().camelize() + "Factory"].factoryRegistry
		  var maxLevel = 0;
		  var key = null
		  for (item in registery) {
			  if (registery[item].level > maxLevel) {
				  maxLevel = registery[item].level
				  key = item
			  }
		  }
		  if (key) {
			  var maxNoOfBuildings = registery[key].currentLevelBluePrints.limiting.others[this.name]
			  if (!maxNoOfBuildings) 
				  maxNoOfBuildings = registery[key].currentLevelBluePrints.limiting.global
			  if (maxNoOfBuildings <= this.noOfBuildings) {
//				  Notification.alert();
          result.valid = false;
          result.msg = "You can only build " + maxNoOfBuildings + " " + this.humanizeString(this.name);
				  return result;
			  }
		  }
		  else {
        result.valid = false;
        result.msg = "Error";
			  return result;
		  }
	  }
    /****************************** Validating resources **************************************/
    var neededRock = this.bluePrints.levels[level].rock - this.game.resources.rock;
    var neededLumber = this.bluePrints.levels[level].lumber - this.game.resources.lumber;
    
    if( neededRock > 0 && neededLumber > 0 ){
      result.valid = false;
      result.msg = "Not enough resources, you need more "+ neededRock +" rock and "+ neededLumber + " lumber";
      return result;
    }
    
    if(  neededRock > 0 ){
      result.valid = false;
      result.msg = "Not enough resources, you need more "+ neededRock +" rock";
      return result;
    }
    
    if( neededLumber > 0 ){
      result.valid = false;
      result.msg = "Not enough resources, you need more "+ neededLumber +" lumber";
      return result;
    }
    /****************************** Validating workers **************************************/
    if( this.game.workerFactory.idleWorkers == 0 ){
      result.valid = false;
      result.msg = "All your workers are busy!";
      return result;
    }
    return result;
  },

  humanizeString : function(str){
  	return str.capitalize().replace("_", " ") 
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

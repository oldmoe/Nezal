var Building = Class.create({
  factory : null,
  level : null,
  remainingBuildTime : null,
  _LoadTime : null,
  coords : {x : null, y : null},
  currentLevelBluePrints : null,
	hp : 0,
	maxHp :0,
  nextLevelBluePrints : null,
	locationValid : true,
  state : 0,
	states : {NOT_PLACED : 0, UNDER_CONSTRUCTION : 1, UPGRADING : 2, NORMAL : 3},
  initialize : function(factory, buildingSpecs){
    this.name = factory.name;
    this.game = factory.game;
    this.canBeBuiltOn = factory.canBeBuiltOn;
    this.factory = factory;
    this._LoadTime = new Date().getTime();
    this.level = buildingSpecs.level;
    this.coords = buildingSpecs.coords;
    this.remainingBuildTime = buildingSpecs.remainingTime;
    this.currentLevelBluePrints = this.factory.bluePrints['levels'][this.level];
    this.nextLevelBluePrints = this.factory.bluePrints['levels'][this.level+1];
		this.maxHp = this.currentLevelBluePrints.hp
		if(buildingSpecs.hp)this.hp = buildingSpecs.hp;
		else this.hp = this.maxHp;
    this.initialState = buildingSpecs.state;
    this.stateNotifications = {};
    for(var state in this.states){
      this.stateNotifications[this.states[state]] = [];  
    }
  },
  
  init : function(){
    this.setState(this.initialState);
    return this;
  },
  
  tick : function(){
    var self = this;
    if (this.state == this.states.UNDER_CONSTRUCTION || this.state == this.states.UPGRADING ) {
      if( this.elapsedTime() >= this.nextLevelBluePrints.time) {
        var delayRequest = this.game.scene.reactor.everySeconds(2);
        self.game.scene.reactor.push(delayRequest, function(){
          self.game.reInitialize();
        });
      }
    } else if (this.state == this.states.NOT_PLACED) {
			this.locationValid = this.validateLocation(this.coords.x,this.coords.y);
	  }
  },
	
	validateLocation : function(x,y){
		var mapCoords = this.game.scene.map.tileValue(x,y);
		var map = this.game.scene.map;
		var cond1 = map.grid[mapCoords[0]][mapCoords[1]].terrainType == this.game.scene.landmarks.get(this.canBeBuiltOn);
		var cond2 = map.validateLocation(this)
    if(!cond1){
      Notification.alert(this.name + " can be built on " + this.canBeBuiltOn + " only!");
      return false;
    }
		if(!cond2){
      //console.log("this location is occupied by another building");
      return false;
    }
		return true;
	},
  
  stateChanged : function(){
  },
  
  setState : function(newState){
    this.state = newState;
    this.stateNotifications[newState].each(function(fn){fn()})
  },
  
  
  
  /** This should return if we need to off the building mood or no*/
  build : function(xBlock, yBlock){
    this.coords['x'] = xBlock;
    this.coords['y'] = yBlock;
    
    if(this.isValidToBuild(xBlock, yBlock)) {
      var response = this.game.network.upgradeBuilding(this.name, this.coords);
      this.game.updateGameStatus(response['gameStatus']);
      return response['done'];
    } else {
      //this.game.buildingMode.cancelBuildingMode();
      return false;
    }
  },

  upgrade: function(){
    if(this.isValidToUpgrade(this.coords.x, this.coords.y)){
      var response = this.game.network.upgradeBuilding(this.name, this.coords);
      this.game.updateGameStatus(response['gameStatus']);
    }
  },
	
	move : function(x,y){
		this.coords['x'] = x;
    this.coords['y'] = y;
    if(this.validateLocation(x,y)){
      var response = this.game.network.moveBuilding(this.name, this.coords, this.oldCoords);
      this.game.updateGameStatus(response['gameStatus']);
      return response['done'];
    }else{
      return false;
    }
	},
  
	inProgress : function(){
    return this.state == this.states.UNDER_CONSTRUCTION || this.state == this.states.UPGRADING;		
	},
	
  elapsedTime : function(){
    if(this.inProgress()){
     return this.nextLevelBluePrints.time - ( this.remainingBuildTime - Math.ceil((new Date().getTime() - this._LoadTime)/1000) );
    }else{
      return 0;
    }
  },
  
  textInfo : function(){
    return this.name.capitalize() + " " + this.level;
  },
	
  isValidToUpgrade : function(x,y){
    if(this.game.disableJsValidation)
      return true;
      
      
    /****************************** Validating workers **************************************/
    if( this.game.workerFactory.idleWorkers == 0 ){
      Notification.alert("Cannot upgrade " + this.name + ", all your workers are busy!");
      return false;
    }
    /****************************** Validating upgrade **************************************/    
    var level = (parseInt(this.level) + 1).toString(); 
    if(!this.factory.bluePrints.levels[level]) {
      Notification.alert("You have reached max upgrade");
      return false;
    }
    /****************************************************************************************/
    
    /****************************** Validating resources **************************************/
    var level = (parseInt(this.level) + 1).toString(); 
    var neededRock = this.factory.bluePrints.levels[level].rock - this.game.resources.rock;
    var neededLumber = this.factory.bluePrints.levels[level].lumber - this.game.resources.lumber;
    
    if( neededRock > 0 && neededLumber > 0 ){
      Notification.alert("Not enough resources, you need more "+ neededRock +" rock and "+ neededLumber + " lumber");
      return false;
    }
    
    if(  neededRock > 0 ){
      Notification.alert("Not enough resources, you need more "+ neededRock +" rock");
      return false;
    }
    
    if( neededLumber > 0 ){
      Notification.alert("Not enough resources, you need more "+ neededLumber +" lumber");
      return false;
    }
    /****************************************************************************************/
   	if(!this.validateLocation(x,y)){
			Map.addElement(this)
		}
		else{
			return false
		} 
	 return true;
  },

  isValidToBuild : function(x,y) {
    if(this.game.disableJsValidation)
      return true;
            
    /****************************** Validating workers **************************************/
    if( this.game.workerFactory.idleWorkers == 0 ){
      Notification.alert("Cannot build " + this.name + ", all your workers are busy!");
      return false;
    }
    /****************************************************************************************/
    
    /****************************** Validating resources **************************************/
    var neededRock = this.factory.bluePrints.levels[1].rock - this.game.resources.rock;
    var neededLumber = this.factory.bluePrints.levels[1].lumber - this.game.resources.lumber;
    
    if( neededRock > 0 && neededLumber > 0 ){
      Notification.alert("Not enough resources, you need more "+ neededRock +" rock and "+ neededLumber + " lumber");
      return false;
    }
    
    if(  neededRock > 0 ){
      Notification.alert("Not enough resources, you need more "+ neededRock +" rock");
      return false;
    }
    
    if( neededLumber > 0 ){
      Notification.alert("Not enough resources, you need more "+ neededLumber +" lumber");
      return false;
    }
    /****************************************************************************************/
    if(this.validateLocation(x,y)){
			Map.addElement(this)
		}
		else{
			return false
		} 
    return true;
  }
  
});

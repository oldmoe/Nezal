var Building = Class.create({
  factory : null,
  level : null,
  remainingBuildTime : null,
  _LoadTime : null,
  coords : {x : null, y : null},
  currentLevelBluePrints : null,
  nextLevelBluePrints : null,
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
    this.initialState = buildingSpecs.state;
    this.stateNotifications = {};
    for(var state in this.states){
      this.stateNotifications[this.states[state]] = [];  
    }
    this.game.scene.push(this);
  },
  
  init : function(){
    this.setState(this.initialState);
    return this;    
  },
  
  tick : function(){
    var self = this;
    if (this.state == this.states.UNDER_CONSTRUCTION) {
      if( this.elapsedTime() >= this.nextLevelBluePrints.time) {
        var delayRequest = this.game.scene.reactor.everySeconds(2);
        self.game.scene.reactor.push(delayRequest, function(){
          self.game.reInitialize();
        });
      }
    }
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
    
    if(this.isValidToBuild(xBlock,yBlock)){
      var response = this.game.network.upgradeBuilding(this.name, this.coords);
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
  
//  render : function(){
//    var self = this;
//    if( this.level == 0 && !this.inProgress ) return;
//    
//    var x = this.coords['x']
//    var y = this.coords['y']
//    
//    if (this.inProgress) {
//      if (!this.game.neighborGame) {
//        $('building-remaining-time').style['top'] = (y - 15) + "px";
//        $('building-remaining-time').style['left'] = (x - 20) + "px";
//        $('building-remaining-time').show();
//        
//        var reactorCallback = function(){
//          var remainingTime = self.upgradeRemainingTime();
//          if (remainingTime > 0) {
//            var remainingText = remainingTime + " Seconds";
//            $('building-remaining-time').innerHTML = self.game.templatesManager.buildingRemainingTime(remainingText);
//            self.game.reactor.push(0, reactorCallback);
//          }
//          else {
//            //Adding a delay before calling the server to overcome time precision errors
//            if (!self.noMore) {
//              self.noMore = true
//              self.game.reactor.push(2, function(){
//                self.noMore = false
//                $('building-remaining-time').hide();
//                self.game.reInitialize();
//              });
//            }
//          }
//        }
//        
//        this.game.reactor.push(0, reactorCallback);
//      }
//      
//    }
//    
//    if( !this.game.neighborGame && this.game.selectedBuildingPanel != null && this.game.selectedBuildingPanel.selectedBuilding.name == this.name ){
//      this.renderPanel();
//    }
//  },
  
  isValidToBuild : function(x,y){
    if(this.game.disableJsValidation)
      return true;
      
      
    /****************************** Validating workers **************************************/
    if( this.game.workerFactory.idleWorkers == 0 ){
      alert("Cannot build " + this.name + ", all your workers are busy!");
      return false;
    }
    /****************************************************************************************/
    
    /****************************** Validating resources **************************************/
    var neededRock = this.factory.bluePrints.levels[1].rock - this.game.resources.rock;
    var neededIron = this.factory.bluePrints.levels[1].iron - this.game.resources.iron;
    
    if( neededRock > 0 && neededIron > 0 ){
      alert("Not enough resources, you need more "+ neededRock +" rock and "+ neededIron + " iron");
      return false;
    }
    
    if(  neededRock > 0 ){
      alert("Not enough resources, you need more "+ neededRock +" rock");
      return false;
    }
    
    if( neededIron > 0 ){
      alert("Not enough resources, you need more "+ neededIron +" iron");
      return false;
    }
    /****************************************************************************************/
   
    /****************************** Validating location **************************************/
   	var mapCoords = this.game.scene.map.tileValue(x,y);
		var map = this.game.scene.map;
		var cond1 = map.grid[mapCoords[0]][mapCoords[1]].terrainType == this.game.scene.landmarks.get(this.canBeBuiltOn);
		var cond2 = map.addElement(this)
    if(!cond1){
      alert(this.name + " can be built on " + this.canBeBuiltOn + " only!");
      return false;
    }
		if(!cond2){
      alert("this location is occupied by another building");
      return false;
    }
    /******************************************************************************************/
   
   return true;
  }
  
});

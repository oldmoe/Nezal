var Townhall = Class.create({
  game : null,
  name : "townhall",
  level : null,
  inProgress : null,
  startedBuildingAt : null,
  coords : {x : null, y : null},
  //This will store the specs and upgrade costs of different townhall levels
  townhallBluePrints : null,
  
  initialize : function(game){
    this.game = game;
    this.townhallBluePrints = this.game.data.buildings.townhall;
    var townhall_json = this.game.user.data.townhall;
    this.level = townhall_json.level;
    this.coords = townhall_json.coords;
    this.inProgress = townhall_json.inProgress;
    this.startedBuildingAt = townhall_json.startedBuildingAt;
    
  },
  
  /** This should return if we need to off the building mood or no*/
  build : function(x, y){
    var self = this;
    
    var xBlock = this.game.scene.xBlock() + x;
    var yBlock = this.game.scene.yBlock() + y;
    this.coords['x'] = xBlock;
    this.coords['y'] = yBlock;
    
    return this.isValidToBuild(xBlock,yBlock) && this.game.upgradeBuilding(this.name, this.coords);
  },
  
  isValidToBuild : function(x,y){
    if(this.game.disableJsValidation)
      return true;
      
      
    /****************************** Validating workers **************************************/
    if( this.game.idleWorkers == 0 ){
      alert("Cannot build townhall, all your workers are busy!");
      return false;
    }
    /****************************************************************************************/
    
    /****************************** Validating resources **************************************/
    var neededRock = this.townhallBluePrints.levels[1].rock - this.game.rock;
    var neededIron = this.townhallBluePrints.levels[1].iron - this.game.iron;
    
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
    if(this.game.scene.map[y][x] != this.game.scene.landmarks.get("grass")){
      alert(this.name + " can be built on grass only!");
      return false;
    }
    /******************************************************************************************/
   
   return true;
  },
  
  render : function(){
    if( this.level == 0 && !this.inProgress ) return;
    
    var blockSize = this.game.scene.navigation.blockSize;
    var x = this.coords['x'] * blockSize - this.game.scene.x;
    var y = this.coords['y'] * blockSize - this.game.scene.y;
    
    console.log("in render => x : " + x + ", y : " + y);
    
    if (this.inProgress) {
      this.game.scene.buildingsLayer.ctx.drawImage(Loader.images.buildings['progress.png'], x, y );
    } else {
      this.game.scene.buildingsLayer.ctx.drawImage(Loader.images.buildings[this.name + '.png'], x, y);
    }
  }
});
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
  
  build : function(x, y){
    if ( this.isValidToBuild(x,y) ) {
      /*
     new Ajax.Request('metadata', {
     method : 'post',
     parameters: { 'data' : Object.toJSON(
     { 'event' :'upgrade',
     'building' : 'townhall',
     'coords' : {'x' : null, 'y' : null} })
     },
     onSuccess: function(response) {
     gameStatus = JSON.parse(response.responseText)
     }
     });*/
    }
  },
  
  isValidToBuild : function(x,y){
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
   console.log("this.game.scene.map[x][y] : " + this.game.scene.map[x][y]);
   console.log('this.game.scene.landmarks["grass"] : ' + this.game.scene.landmarks.get("grass"));
    if(this.game.scene.map[x][y] != this.game.scene.landmarks.get("grass")){
      alert(this.name + " can be built on grass only!");
      return false;
    }
    /******************************************************************************************/
   
   return true;
  },
  
  render : function(){
    
  }
});
var Townhall = Class.create({
  game : null,
  name : "townhall",
  level : null,
  inProgress : null,
  startedBuildingAt : null,
  coords : {x : null, y : null},
  //This will store the specs and upgrade costs of different townhall levels
  bluePrints : null,
  
  initialize : function(game){
    this.game = game;
    this.bluePrints = this.game.data.buildings.townhall;
    var townhall_json = this.game.user.data.townhall;
    this.level = townhall_json.level;
    this.coords = townhall_json.coords;
    this.game.scene.registerLocation(this.coords['x'], this.coords['y'], this);
    this.inProgress = townhall_json.inProgress;
    this.startedBuildingAt = townhall_json.startedBuildingAt;
    
  },
  
  /** This should return if we need to off the building mood or no*/
  build : function(x, y){
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
    if( this.game.workerFactory.idleWorkers == 0 ){
      alert("Cannot build townhall, all your workers are busy!");
      return false;
    }
    /****************************************************************************************/
    
    /****************************** Validating resources **************************************/
    var neededRock = this.bluePrints.levels[1].rock - this.game.resources.rock;
    var neededIron = this.bluePrints.levels[1].iron - this.game.resources.iron;
    
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
  
  upgradeRemainingTime : function(){
    if(this.inProgress){
      var since = new Date(this.startedBuildingAt * 1000).getTime();
      var now = new Date().getTime();
      var required = this.bluePrints['levels'][this.level+1]['time'];
      return required - Math.ceil((now - since)/1000);
    }else{
      return 0;
    }
  },
  
  render : function(){
    var self = this;
    if( this.level == 0 && !this.inProgress ) return;
    
    var blockSize = this.game.scene.navigation.blockSize;
    var x = this.coords['x'] * blockSize - this.game.scene.x;
    var y = this.coords['y'] * blockSize - this.game.scene.y;
    
    //console.log("in render => x : " + x + ", y : " + y);
    
    if (this.inProgress) {
      this.game.scene.buildingsLayer.ctx.drawImage(Loader.images.buildings['progress.png'], x, y );
      $('building-remaining-time').style['top'] = (y - 15) + "px";
      $('building-remaining-time').style['left'] = (x - 20) + "px";
      $('building-remaining-time').show();
      
      var reactorCallback = function(){
        var remainingTime = self.upgradeRemainingTime();
        if( remainingTime > 0 ){
          var remainingText = remainingTime + " Seconds";
          $('building-remaining-time').innerHTML = self.game.templatesManager.buildingRemainingTime(remainingText);
          self.game.reactor.push(0, reactorCallback);
        }else{
          //Adding a delay before calling the server to overcome time precision errors
          if (!self.noMore) {
            self.noMore = true
            self.game.reactor.push(2, function(){
              self.noMore = false
              $('building-remaining-time').hide();
              self.game.reInitialize(function(){
                self.game.scene.render();
              });
            });
          }
        }
      }
      
      this.game.reactor.push(0, reactorCallback);
      
    } else {
      this.game.scene.buildingsLayer.ctx.drawImage(Loader.images.buildings[this.name + '.png'], x, y);
    }
    
    if( this.game.selectedBuildingPanel != null && this.game.selectedBuildingPanel.selectedBuilding.name == this.name ){
      this.renderPanel();
    }
  },
  
  renderPanel : function(){
    var self = this;
    this.game.selectedBuildingPanel = new BuildingPanel(this, function(){
      return self.game.templatesManager.townhallPanel(self.name, self.inProgress, this.game.workerFactory.nextWorkerCost());
    });
  }
});
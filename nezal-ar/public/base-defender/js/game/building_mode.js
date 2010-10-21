var BuildingMode = Class.create({
  game : null,
  buildings : ['townhall', 'quarry', 'mine'],
  inProgressImage : 'progress.png',
  isOn : false,
  selectedBuilding : null,
  callback : null,
  
  initialize : function(game){
    this.game = game;
    var self = this;
    $('canvasContainer').observe('click', function(mouse){
      if(!self.isOn) return ;

      //Our map is the reverse of these :)
      var x = mouse.pointerX();
      var y = mouse.pointerY();
      
      var blockX = Math.floor(x / game.scene.navigation.blockSize);
      var blockY = Math.floor(y / game.scene.navigation.blockSize);

      if (self.selectedBuilding.build(blockX, blockY)) {
        self.game.scene.render();
        self.callback();
        self.off();
      }
    });
  },
  
  on : function(building, callback){
    this.isOn = true;
    this.callback = callback;
    this.selectedBuilding = building;
  },
  
  off : function(){
    this.isOn = false;
  }
});
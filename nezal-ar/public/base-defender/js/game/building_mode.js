var BuildingMode = Class.create({
  game : null,
  buildings : ['townhall', 'quarry', 'mine'],
  inProgressImage : 'progess.png',
  isOn : false,
  selectedBuilding : null,
  callback : null,
  
  initialize : function(game){
    this.game = game;
    self = this;
    $('canvasContainer').observe('click', function(mouse){
      if(!self.isOn) return ;
      
      var x = mouse.pointerX();
      var y = mouse.pointerY();
      
      var blockX = Math.floor(x / game.scene.navigation.blockSize);
      var blockX = Math.floor(y / game.scene.navigation.blockSize);
      
      self.selectedBuilding.build(blockX, blockX);
      callback();
      
      self.off();
    });
  },
  
  on : function(buildingClass, callback){
    this.isOn = true;
    this.callback = callback;
    this.selectedBuilding = buildingClass;
  },
  
  off : function(){
    this.isOn = false;
  }
});
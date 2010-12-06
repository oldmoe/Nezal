var BuildingMode = Class.create({
  game : null,
  buildings : ['townhall', 'quarry', 'mine'],
  inProgressImage : 'progress.png',
  isOn : false,
  selectedBuilding : null,
  callback : null,
  
  initialize : function(game){
    this.game = game;
    this._AttachCanvasClickListener();
    this._AttachBuildingPanelCloseListeners();
  },
  
  on : function(building, callback){
    this.isOn = true;
    this.callback = callback;
    this.selectedBuilding = building;
  },
  
  off : function(){
    this.isOn = false;
  },
  
  _AttachCanvasClickListener : function(){
    var self = this;
    $('canvasContainer').observe('click', function(mouse){
      if(self.game.neighborGame)
        return;
      
      var x = mouse.pointerX();
      var y = mouse.pointerY();
      
      var blockX = Math.floor(x / game.scene.navigation.blockSize);
      var blockY = Math.floor(y / game.scene.navigation.blockSize);
        
      if(self.isOn) 
        self._ModeOnAction(blockX, blockY);
      else
        self._ModeOffAction(blockX, blockY);
    });
  },
  
  _ModeOffAction : function(blockX, blockY){
    var selectedBuilding = this.game.scene.lookupLocation(blockX, blockY);
    if(selectedBuilding){
      selectedBuilding.renderPanel();
      $('building-panel').show();
    }
  },
  
  _ModeOnAction : function(blockX, blockY){
    if (this.selectedBuilding.build(blockX, blockY)) {
      this.callback();
      this.off();
    }
  },
  _AttachBuildingPanelCloseListeners : function(){
    var self = this;
    var closeCallback = function(){
      $('building-panel').hide();
      self.game.selectedBuildingPanel = null;
    }
    
    $('close-building-panel').observe('click', closeCallback);
    document.observe('keydown', function(event){
      if (event.keyCode == Event.KEY_ESC) {
        closeCallback();
      }
    });
  }
});
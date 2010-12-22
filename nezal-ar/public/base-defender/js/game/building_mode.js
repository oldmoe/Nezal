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
    $('clickCanvas').observe('click', function(mouse){
      if(self.game.neighborGame)
        return;
      
      var x = mouse.pointerX();
      var y = mouse.pointerY();
	  	var mapCoords =  Map.getRealCoords(x,y)
	  	console.log(x,y,Map.tileValue(x,y))
      if(self.isOn) 
        self._ModeOnAction(mapCoords.x, mapCoords.y);
      else
        self._ModeOffAction(mapCoords.x, mapCoords.y);
    });
  },
  
  _ModeOffAction : function(x, y){
    var selectedBuilding = this.game.scene.map.lookupLocation(x, y);
    if(selectedBuilding){
      selectedBuilding.renderPanel();
      $('building-panel').show();
    }
  },
  
  _ModeOnAction : function(x, y){
    if (this.selectedBuilding.build(x, y)) {
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
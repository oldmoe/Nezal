var BuildingMode = Class.create({
  game : null,
  buildings : ['townhall', 'quarry', 'lumbermill','storage','defense_center', 'wedge'],
  inProgressImage : 'progress.png',
  isOn : false,
  selectedBuilding : null,
  callback : null,
  buildingMoveObserver : null,
	moveBuilding : false,
  initialize : function(game){
    this.game = game;
    this._AttachCanvasClickListener();
		this._AttachCancelBuildingListener();
  },
  
  on : function(building, callback){
    if( this.selectedBuilding && this.selectedBuilding.state == 0 ){
      this.cancelBuildingMode();
    }
    this.isOn = true;
    this.callback = callback;
    this.selectedBuilding = building;
		this._AttachMouseMoveEvent();
		$('cancelBuilding').show();
  },
	
	move: function(){
		if(!this.selectedBuilding)return
		this.moveBuilding = true;
		Map.objects.remove(this.selectedBuilding);
		this.selectedBuilding.oldCoords = {};
		this.selectedBuilding.oldCoords.x = this.selectedBuilding.coords.x;
		this.selectedBuilding.oldCoords.y = this.selectedBuilding.coords.y;
		this.selectedBuilding.setState(this.selectedBuilding.states.NOT_PLACED);
		this.on(this.selectedBuilding);
	},
	
	_AttachMouseMoveEvent : function(){
		var self = this;
		this.buildingMoveObserver = function(mouse){
			var mapCoords = Map.getRealCoords(mouse.pointerX(), mouse.pointerY());
    	self.selectedBuilding.coords.x = mapCoords.x;
			self.selectedBuilding.coords.y = mapCoords.y;
      self.selectedBuilding.render()
		}
		$('gameCanvas').observe('mousemove', this.buildingMoveObserver);
	},
  
  off : function(){
		this.moveBuilding = false
    this.isOn = false;
		$('gameCanvas').stopObserving('mousemove', this.buildingMoveObserver);
		$('cancelBuilding').hide();
  },
  
	cancelBuildingMode : function(){
		if (this.moveBuilding) {
			this._ModeOnAction(this.selectedBuilding.oldCoords.x,this.selectedBuilding.oldCoords.y)
		}
		else {
			this.selectedBuilding.destroy();
			this.selectedBuilding = null;
		}	
		this.off();
	},
	
  _AttachCanvasClickListener : function(){
    var self = this;
    $('gameCanvas').observe('click', function(mouse){
      if(self.game.neighborGame)
        return;
      var x = mouse.pointerX();
      var y = mouse.pointerY();
	  	var mapCoords =  Map.getRealCoords(x,y)
      if(self.isOn) 
        self._ModeOnAction(mapCoords.x, mapCoords.y);
    });
  },
	
  _ModeOnAction : function(x, y){
		if(this.moveBuilding){
			this.moveBuilding = false;
			this.selectedBuilding.move(x,y)
		}
    else if (this.selectedBuilding.build(x, y)) {
      this.callback();
      this.off();
    }
  },

	_AttachCancelBuildingListener : function(){
		var self = this;
		$('cancelBuilding').observe('click',function(){self.cancelBuildingMode()})
	},
	
	repair : function(){
		var response = this.game.network.repairBuildings();
		this.game.updateGameStatus(response['gameStatus']);
	},
	
	collect : function(building){
		var townHall = this.game.townhallFactory.townhall;
		var worker  = new Worker(game,building.coords.x,building.coords.y-10);
		worker.randomMove = false;
		var workerDisplay = new WorkerDisplay(worker)
		this.game.scene.pushAnimation(workerDisplay);
		game.scene.push(worker); 
		var callback2 = function(){
			game.scene.removeAnimation(workerDisplay);
			game.scene.remove(worker);
		}
		var callback1 = function(){
			Map.moveObject(worker, building.coords.x,building.coords.y-10, callback2, true);
		}
		Map.moveObject(worker, townHall.coords.x, townHall.coords.y, callback1, true);
	}
});

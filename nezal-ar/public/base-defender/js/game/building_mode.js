var BuildingMode = Class.create({
  game : null,
  buildings : ['townhall', 'quarry', 'lumbermill','storage','defense_center', 'palm',
  'wedge','war_factory','house', 'gaddafi'],
  wedges : ['wedge', 'gaddafi'],
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
	this._AttachZoomListener();
		//if($('cancelBuilding')) $('cancelBuilding').hide();
  },
  
  _AttachZoomListener : function(){
  	var self = this
  	$('zoom').observe('click',function(){
		self.zoom()
	})
  },
  showBuildingBases : function(){
  	Map.objects.each(function(building){
		building.sprites.base.show()
	})
  },
  hideBuildingBases : function(){
  	Map.objects.each(function(building){
		building.sprites.base.hide()
	})
  },
  on : function(building, callback){
    if( this.selectedBuilding && this.selectedBuilding.state == 0 ){
      this.cancelBuildingMode();
    }
    this.isOn = true;
	this.showBuildingBases()
    this.callback = callback;
    this.selectedBuilding = building;
		this._AttachMouseMoveEvent();
    //this._AttachCanvasClickListener();
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
			var x =  mouse.pointerX() || mouse.touches[0].pageX;
			var y = mouse.pointerY() || mouse.touches[0].pageY;
			var mapCoords = Map.getRealCoords(x,y);
			if(self.game.zoomFactor ==0.5){
					mapCoords.x+= mapCoords.x - Map.mapWidth/2
					mapCoords.y+= mapCoords.y - Map.mapHeight/2 
			}
	    	self.selectedBuilding.coords.x = mapCoords.x;
			self.selectedBuilding.coords.y = mapCoords.y;
      		self.selectedBuilding.render();
		}
    $('gameCanvas').stopObserving(game.mouseMoveEvent);
		$('gameCanvas').observe(game.mouseMoveEvent, this.buildingMoveObserver);
	},
  
  off : function(){
		this.moveBuilding = false;
   		this.isOn = false;
    	this.selectedBuilding = null;
		this.hideBuildingBases()
		$('gameCanvas').stopObserving(game.mouseMoveEvent, this.buildingMoveObserver);
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
    $('gameCanvas').stopObserving(game.mouseClickEvent);
    $('gameCanvas').observe(game.mouseClickEvent, function(mouse){
      if(game.neighborGame)
        return;
      var x = mouse.pointerX() || mouse.touches[0].pageX;
      var y = mouse.pointerY() || mouse.touches[0].pageY;
	  	var mapCoords =  Map.getRealCoords(x,y)
      if(game.buildingMode.isOn) 
        game.buildingMode._ModeOnAction();
    });
  },
	
  _ModeOnAction : function(){
		if(this.moveBuilding){
			this.moveBuilding = false;
			this.selectedBuilding.move(this.selectedBuilding.coords.x,this.selectedBuilding.coords.y)
			this.hideBuildingBases()
		}
    	else if (this.selectedBuilding.build(this.selectedBuilding.coords.x, this.selectedBuilding.coords.y)) {
      		this.callback();
			this.hideBuildingBases()
      		//this.off();
    	}
  },

	_AttachCancelBuildingListener : function(){
		var self = this;
    $('cancelBuilding').stopObserving(game.mouseClickEvent);
		$('cancelBuilding').observe(game.mouseClickEvent,function(){self.cancelBuildingMode()})
	},
	
	repair : function(){
		var response = this.game.network.repairBuildings();
		this.game.updateGameStatus(response['gameStatus']);
	},
	
	zoom : function(){
		if(game.zoomFactor ==1){
			game.zoomFactor = 0.5
			$('gameCanvas').addClassName('zoomed')
			$('zoom').removeClassName('in')
			$('zoom').addClassName('out')
		}else{
			game.zoomFactor = 1
			$('gameCanvas').removeClassName('zoomed')
			$('zoom').removeClassName('out')
			$('zoom').addClassName('in')
		}
		Map.centerMap(game.zoomFactor) 
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
			worker.movingPath = Map.moveObject(worker, building.coords.x,building.coords.y-10, callback2, true);
		}
		worker.movingPath = Map.moveObject(worker, townHall.coords.x, townHall.coords.y, callback1, true);
	}
});

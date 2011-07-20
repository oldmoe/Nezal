var BuildingMode = Class.create({
  game : null,
  buildings : ['townhall', 'quarry', 'lumbermill','storage','defense_center',
  'palm','wedge','war_factory','house', 'gaddafi', 'garage', 'defense_research', 'military_research', 'green_wedge', 'blue_wedge'],
  wedges : ['wedge', 'green_wedge', 'blue_wedge', 'gaddafi'],
  inProgressImage : 'progress.png',
  isOn : false,
  selectedBuilding : null,
  callback : null,
  buildingMoveObserver : null,
  moveBuilding : false,
  buildingClicked : false,
  moveMode : false,
  initialize : function(game){
    this.game = game;
    this._AttachCanvasClickListener();
	  this._AttachCancelBuildingListener();
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

	move : function(){
		if(!this.selectedBuilding)return
		if(this.selectedBuilding.state!=this.selectedBuilding.states.NORMAL){
			Notification.alert("Can't move building.")
			this.selectedBuilding = null
			return 
		} 
		this.moveBuilding = true;
		Map.objects.remove(this.selectedBuilding);
		this.selectedBuilding.oldCoords = {};
		this.selectedBuilding.oldCoords.x = this.selectedBuilding.coords.x;
		this.selectedBuilding.oldCoords.y = this.selectedBuilding.coords.y;
		this.selectedBuilding.setState(this.selectedBuilding.states.NOT_PLACED);
		this.on(this.selectedBuilding)
	},
	on : function(building, callback){
	    this.isOn = true;
		this.showBuildingBases()
	    this.callback = callback;
	    this.selectedBuilding = building;
		this._AttachMouseMoveEvent();
		$('cancelBuilding').show();
    },
	
	_AttachMouseMoveEvent : function(){
		var self = this;
		this.buildingMoveObserver = function(mouse){
			var x =  mouse.pointerX() || mouse.touches[0].pageX;
			var y = mouse.pointerY() || mouse.touches[0].pageY;
			var mapCoords = Map.getRealCoords(x,y);
			if(self.game.zoomFactor == 0.5){
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
		$('gameCanvas').stopObserving(game.mouseMoveEvent, this.buildingMoveObserver);
  },
  
	cancelBuildingMode : function(){
		if (this.moveBuilding) {
			this._ModeOnAction(this.selectedBuilding.oldCoords.x,this.selectedBuilding.oldCoords.y)
		}
		else {
			this.selectedBuilding.destroy();
      game.scene.remove(this.selectedBuilding)
			this.selectedBuilding = null;
			if (!this.moveMode) {
				this.hideBuildingBases()
				$('cancelBuilding').hide();
			}
		}	
		this.off();
	},
	
  _AttachCanvasClickListener : function(){
	var self = this
    $('gameCanvas').stopObserving(game.mouseClickEvent);
    $('gameCanvas').observe(game.mouseClickEvent, function(mouse){
		if(self.buildingClicked){
			self.buildingClicked = false
			return
		}
      if(game.neighborGame)
        return;
      var x = mouse.pointerX() || mouse.touches[0].pageX;
      var y = mouse.pointerY() || mouse.touches[0].pageY;
	  	var mapCoords =  Map.getRealCoords(x,y)
      if(game.buildingMode.isOn) 
        self._ModeOnAction(self.selectedBuilding.coords.x,self.selectedBuilding.coords.y);
    });
  },
	
  _ModeOnAction : function(x,y){
		if(this.moveBuilding){
			if (this.selectedBuilding.move(x,y)) {
				this.moveBuilding = false;
				this.cancelBuildingMode()
				this.showBuildingBases()
			}
		} else { 
      this.selectedBuilding.build(x,y);
  		if (this.selectedBuilding.name != 'palm') {
  			this.hideBuildingBases()
  			this.off()
  			$('cancelBuilding').hide()
  		}
  		this.callback();
  		//this.off();
  	}
  },

	_AttachCancelBuildingListener : function(){
		var self = this;
    $('cancelBuilding').stopObserving(game.mouseClickEvent);
		$('cancelBuilding').observe(game.mouseClickEvent,
			function(){
				if (self.moveMode) {
					self.moveMode = false
				}
				if (self.selectedBuilding) {
					self.cancelBuildingMode()
				}
				self.hideBuildingBases()
				$('cancelBuilding').hide()
			}
	    )
	},
	
	repair : function(){
    var self = this;
		this.game.network.repairBuildings(function(response){
      self.game.updateGameStatus(response.gameStatus);
    });
		
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

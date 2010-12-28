var ResourceBuilding = Class.create(Building, {
  assignedWorkers : null,
  maxWorkers : null,
  unitPerWorkerTick : null,
  
  initialize : function($super, factory, buildingSpecs){
    $super(factory, buildingSpecs);
    this.assignedWorkers = buildingSpecs.assigned_workers || 0;
    if (this.level > 0) {
      this.maxWorkers = this.currentLevelBluePrints.max_workers;
      this.unitPerWorkerMinute = this.currentLevelBluePrints.unit_per_worker_minute
			this.unitPerWorkerTick = (this.unitPerWorkerMinute / (60)) * (this.game.reactor.delay / 1000);
			this.totalPerTick = this.unitPerWorkerTick * this.assignedWorkers
    }
  },
	
	tick : function($super){
    $super();
		if (this.state == this.states.NORMAL) {
			this.game.resources[this.factory.canBeBuiltOn] += this.totalPerTick;
		}
		return this;
	},
  
  renderPanel : function(){
    var self = this;
    this.game.selectedBuildingPanel = new BuildingPanel(this, function(){
      return self.game.templatesManager.resourceBuildingPanel(self);
    });
    this._AttachAssignTrigger();
  },
  
  _AttachAssignTrigger: function(){
    var self = this;
    if($$('.building-functions').any()){
      var trigger = $('assign_worker_trigger');
    
      trigger.observe('click', function(){
        self._AssignWorker();
      });
    }
  },
  
  _AssignWorker: function(){
    if(this._ValidateAssignWorker()){
      var response = this.game.network.assignWorker(this.name, this.coords);
      this.game.updateGameStatus(response['gameStatus']);
    }
  },
  
  _ValidateAssignWorker: function(){
    if( this.assignedWorkers >= this.maxWorkers ){
      alert("Cannot assign more workers, please upgrade the " + this.name + " first!");
      return false;
    }
    
    if (this.game.workerFactory.idleWorkers == 0) {
      alert("Cannot assign a worker, all your workers are busy!");
      return false;
    }
    
    return true;
  }
});
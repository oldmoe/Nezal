var ResourceBuilding = Class.create(Building, {
  assignedWorkers : null,
  maxWorkers : null,
  unitPerWorkerTick : null,
  capacity : null,
  producing : true,
  initialize : function($super, factory, buildingSpecs){
    $super(factory, buildingSpecs);
    this.assignedWorkers = buildingSpecs.assigned_workers || 0;
    this[this.factory.collect] = buildingSpecs[this.factory.collect]
    if (this.level > 0) {
      this.maxWorkers = this.currentLevelBluePrints.max_workers;
      this.unitPerWorkerMinute = this.currentLevelBluePrints.unit_per_worker_minute
			this.unitPerWorkerTick = (this.unitPerWorkerMinute / (60)) * (this.game.reactor.delay / 1000);
      this.capacity = this.currentLevelBluePrints.capacity
    }
  },

  resource : function(){
    return this.factory.collect + " : " + parseInt(this[this.factory.collect]);
  },
	
  totalPerTick : function(){
		var collected = this.unitPerWorkerTick * this.assignedWorkers
    if (this[this.factory.collect] + collected > this.capacity) {
			this.producing = false
			return (this.capacity - this[this.factory.collect]);
		}
		else {
			this.producing = true
			return collected;
		}
  },

	tick : function($super){
    $super();
		if (this.state == this.states.NORMAL) {
			this[this.factory.collect] += this.totalPerTick();
		}
		return this;
	},
  
  _AssignWorker: function(){
    if(this._ValidateAssignWorker()){
      var response = this.game.network.assignWorker(this.name, this.coords);
      this.game.updateGameStatus(response['gameStatus']);
    }
  },

  _CollectResources: function(){
    var response = this.game.network.collectResources(this.name, this.coords);
    this.game.updateGameStatus(response['gameStatus']);
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
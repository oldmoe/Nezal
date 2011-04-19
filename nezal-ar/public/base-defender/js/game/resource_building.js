var ResourceBuilding = Class.create(Building, {
  assignedWorkers : null,
  maxWorkers : null,
  unitPerWorkerTick : null,
  capacity : null,
  producing : true,
  full : false,
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
	this.fullObservers = []
  },
	
  
  resourceInfo : function(){
  	if(!this.capacity)return ''
    var data = parseInt(this[this.factory.collect])+"/"+ this.capacity
	if (!this.isFull() && this.assignedWorkers!=0) {
		data += "<br/>Full in " + this.remainingTime();
	}
	return data
  },
  isFull : function(){
  	   return parseInt(this[this.factory.collect]) == this.capacity
  },
	
  getResourceMeterLength : function(){
  	return  parseInt(this[this.factory.collect]) / this.capacity	
  },
  	
  totalPerTick : function(){
		var collected = this.unitPerWorkerTick * this.assignedWorkers
    	if (this[this.factory.collect] + collected > this.capacity) {
			this.producing = false
			this.full = true
			return (this.capacity - this[this.factory.collect]);
		}
		else {
			this.producing = true
			return collected;
		}
  },
  
  remainingTime : function(){
  	var seconds = Math.round((this.capacity-this[this.factory.collect])*60/ (this.assignedWorkers*this.unitPerWorkerMinute))
	return Util.timeDisplay(seconds) 
  },

	tick : function($super){
		if(!this.working || !this.owner.producing) return
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
      Notification.alert("Cannot assign more workers, please upgrade the " + this.name + " first!");
      return false;
    }
    
    if (this.game.workerFactory.idleWorkers == 0) {
      Notification.alert("Cannot assign a worker, all your workers are busy!");
      return false;
    }
    
    return true;
  }
});

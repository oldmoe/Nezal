var WorkerFactory = Class.create({
  game : null,
  workers : null,
  idleWorkers : null,
  recruitmentPlans : null,
  initialize : function(game){
    this.game = game;
    this.workers = this.game.user.data.workers;
    this.idleWorkers = this.game.user.data.idle_workers;
    this.recruitmentPlans = this.game.data.workers;
		if(!game.workersStatus) game.workersStatus = {}
		for(var i=0;i<this.idleWorkers;i++){
			var x =0;var y=0;var worker = null;
			if (game.workersStatus[i]) {
		  	worker = game.workersStatus[i]
		  }
		  else {
		  	do {
		  		var x = Math.round(game.scene.map.x + game.scene.map.viewWidth * Math.random())
		  		var y = Math.round(game.scene.map.y + game.scene.map.viewHeight * Math.random())
		  	}
		  	while (Map.occupied(x, y));
				worker = new Worker(game,x,y)
		  }
			if(!game.workersStatus[i])game.workersStatus[i] = worker
			game.scene.push(worker); 
			var workerDisplay = new WorkerDisplay(worker)
			this.game.scene.pushAnimation(workerDisplay);
		}
  },
  
  nextWorkerCost : function(){
    return this.recruitmentPlans[this.workers + 1].coins;
  },
  
  attachHireTrigger : function(){
    var self = this;
    var trigger = $('buy_worker_trigger');
    
    //This is needed because the panel may be activated while the building is in progress
    //and the trigger will not exist
    if (trigger) {
      trigger.observe('click', function(){
        self.buyWorker();
      });
    }
  },
  
  buyWorker : function(){
    if(this._ValidateBuyWorker()){
      var response = this.game.network.buyWorker();
      this.game.updateGameStatus(response['gameStatus']);
    }
  },
  
  _ValidateBuyWorker : function(){
    if(this.game.disableJsValidation) return true;
    if (this.game.user.coins >= this.nextWorkerCost()) {
      return true;
    } else {
      var remainingRequiredCoins = this.nextWorkerCost() - this.game.user.coins;
      alert("Not enough coins, you need " + remainingRequiredCoins + " more coins!");
      return false;
    }
  }
});

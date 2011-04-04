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
		var townhall = this.game.townhallFactory.getTownhall()
		for(var i=0;i<this.idleWorkers;i++){
		  var x =0;var y=0;var worker = null;
		  if (game.workersStatus[i]) {
		  	worker = game.workersStatus[i]
		  }
		  else {
				var x =0;var y =0;
				if (townhall) {
		  			x = townhall.coords.x + 30
		  			y = townhall.coords.y + 30
		  		}else{
		  			do {
						 x = Math.round(game.scene.map.x + game.scene.map.viewWidth * Math.random())
						 y = Math.round(game.scene.map.y + game.scene.map.viewHeight * Math.random())
						}while (Map.occupied(x, y));
		  	}
		  	
				worker = new Worker(game,x,y)
		  }
			worker.randomMove = true
			if(!game.workersStatus[i])game.workersStatus[i] = worker
			game.scene.push(worker); 
			var workerDisplay = new WorkerDisplay(worker)
			this.game.scene.pushAnimation(workerDisplay);
		}
  },
  
  nextWorkerCost : function(){
    return this.recruitmentPlans.initial_coins * this.recruitmentPlans.factor;
  },
  
  attachHireTrigger : function(){
    var self = this;
    var trigger = $('buy_worker_trigger');
    
    //This is needed because the panel may be activated while the building is in progress
    //and the trigger will not exist
    if (trigger) {
      trigger.observe(game.mouseClickEvent, function(){
        self.buyWorker();
      });
    }
  },
  
  buyWorker : function(){
    if(this._ValidateBuyWorker()){
			var buyWorkerCallback = function(){
	  		var response = this.game.network.buyWorker();
	  		this.game.updateGameStatus(response['gameStatus']);
	  	}
			this.game.townhallFactory.getTownhall().producingCallback = buyWorkerCallback
			this.game.townhallFactory.getTownhall().producing = true
    }
  },
  
  _ValidateBuyWorker : function(){
  	if(!this.game.townhallFactory.getTownhall() ||
	this.game.townhallFactory.getTownhall().state != this.game.townhallFactory.getTownhall().states.NORMAL){
	  Notification.alert("You need to have a townhall before hiring a worker.");
      return false;
	}
    if(this.game.disableJsValidation) return true;
	
	var total_workers_allowed = this.recruitmentPlans.initial_allowed
	var houses = this.game.houseFactory.factoryRegistry
	var house_data = this.game.data.buildings.house
	for(house in houses){
		total_workers_allowed+= house_data.levels[houses[house].level].workers		
	}
	if(total_workers_allowed <= this.workers){
		 Notification.alert("You need to build more houses");
		 return false;
	}
    if (this.game.user.coins >= this.nextWorkerCost()) {
      return true;
    } else {
      var remainingRequiredCoins = this.nextWorkerCost() - this.game.user.coins;
      Notification.alert("Not enough coins, you need " + remainingRequiredCoins + " more coins!");
      return false;
    }
  }
});

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
    return this.recruitmentPlans.initial_coins * (this.workers + 1) * this.recruitmentPlans.factor;
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
    if(this.validateBuyWorker()){
			var buyWorkerCallback = function(){
	  		var response = this.game.network.buyWorker();
	  		this.game.updateGameStatus(response['gameStatus']);
	  	}
			this.game.townhallFactory.getTownhall().producingCallback = buyWorkerCallback
			this.game.townhallFactory.getTownhall().producing = true
    }
  },
  
  totalWorkersAllowed : function(){
    var total_workers_allowed = this.recruitmentPlans.initial_allowed
    var houses = this.game.houseFactory.factoryRegistry
    var house_data = this.game.data.buildings.house
    for(var house in houses){
      if(houses[house].state == houses[house].states.NORMAL)
      total_workers_allowed+= house_data.levels[houses[house].level].workers    
    }
    
    return total_workers_allowed;
  },
  
  notEnoughCoins : function(){
    return this.game.user.coins < this.nextWorkerCost();
  },
  
  notEnoughHousing : function(){
    return this.totalWorkersAllowed() <= this.workers;
  },
  
  validateBuyWorker : function(silent){
    if(this.game.disableJsValidation) return true;

  	if(!this.game.townhallFactory.getTownhall() ||
	       this.game.townhallFactory.getTownhall().state != this.game.townhallFactory.getTownhall().states.NORMAL){
	    if(!silent) Notification.alert("You need to have a townhall before hiring a worker.");
      return false;
	  }
	
  	if( this.notEnoughHousing() ){
  		 if(!silent) Notification.alert("Not enough housing. You need to build more houses");
  		 return false;
  	}
    
    if( this.notEnoughCoins() ) {
      var remainingRequiredCoins = this.nextWorkerCost() - this.game.user.coins;
      if(!silent) Notification.alert("Not enough coins, you need " + remainingRequiredCoins + " more coins!");
      return false;
    }
    
    return true;
  }
});

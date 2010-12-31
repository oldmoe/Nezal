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
      console.log('before update game status')
      this.game.updateGameStatus(response['gameStatus']);
      console.log('before update game status')
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

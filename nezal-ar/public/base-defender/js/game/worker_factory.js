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
    this.recruitmentPlans
  },
  
  attachHireEvent : function(eventTrigger){
    var self = this;
    eventTrigger.observe('click', function(){
      self.buyWorker();
    })
  },
  
  buyWorker : function(){
    if(this._ValidateBuyWorker()){
      
    }
  },
  
  _ValidateBuyWorker : function(){
    if(this.game.disableJsValidation) return true;
    
    if(this.game.user.coins){}
  }
});
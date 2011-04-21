var WorkerPanel = Class.create(MenuPanel, {
  initialize : function($super){
    var self = this;
    var afterTemplatingCallback = function(){
      $("hire-worker-button").stopObserving(game.mouseClickEvent);
      $("hire-worker-button").observe(game.mouseClickEvent, function(){
        self.hide();
        game.workerFactory.buyWorker();
      })
    }
    var templater = function(){
      return game.templatesManager.load("worker-menu-contents", {workerFactory : game.workerFactory});
    }
    $super("workers", templater, afterTemplatingCallback );
  }
})

/**
 * @author nomier
 */
var GamePanel = Class.create({
  initialize : function(game){
		this.game = game;
    var self = this;
    $('workers_game_element').stopObserving(game.mouseClickEvent);
    $('workers_game_element').observe(game.mouseClickEvent,
                                      function(){
                                        self.game.workerPanel.render();
                                      })
	},
	getTotalStorageCapacity : function(){
		if(!game.townhallFactory.getTownhall()) return null;
		var totalCapacity = game.townhallFactory.getTownhall().storageCapacity
		var storages = game.storageFactory.factoryRegistery
		for(key in storages){
			totalCapacity +=storages[key].storageCapacity
		}
		this.totalStorageCapacity = totalCapacity
		return totalCapacity
  	},
  
	render : function(){
	    if(this.game.neighborGame) return;
		var rockValue = this.game.resources.rock
		var lumberValue = this.game.resources.lumber
	    var rock = this.game.scene._FormatResourceDisplay(rockValue);
	    var lumber = this.game.scene._FormatResourceDisplay(lumberValue);
		var totalCapacity = this.getTotalStorageCapacity()
		if (totalCapacity) {
			$$('#rockBar .resourceBarMiddle')[0].setStyle({
				width: Math.min(83, Math.round(rockValue * 100 / totalCapacity)) + '%'
			})
			$$('#lumberBar .resourceBarMiddle')[0].setStyle({
				width: '' + Math.min(83, Math.round(lumberValue * 100 / totalCapacity)) + '%'
			})
		}
	    $('rock-amount').innerHTML = this.game.templatesManager.load("resource-amount-display", {amount : rock});
	    $('lumber-amount').innerHTML = this.game.templatesManager.load("resource-amount-display", {amount : lumber});
	    $('workers-amount').innerHTML = this.game.templatesManager.load("workers-in-game-panel",
	            {idleWorkers : this.game.workerFactory.idleWorkers, totalWorkers : this.game.workerFactory.workers});
	    $('coins-amount').innerHTML = this.game.user.coins;
  }
})

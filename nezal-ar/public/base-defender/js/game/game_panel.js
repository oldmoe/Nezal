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
	render : function(){
    if(this.game.neighborGame) return;
    var rock = this.game.scene._FormatResourceDisplay(this.game.resources.rock);
    var lumber = this.game.scene._FormatResourceDisplay(this.game.resources.lumber);
    $('rock-amount').innerHTML = this.game.templatesManager.load("resource-amount-display", {amount : rock});
    $('lumber-amount').innerHTML = this.game.templatesManager.load("resource-amount-display", {amount : lumber});
    $('workers-amount').innerHTML = this.game.templatesManager.load("workers-in-game-panel",
            {idleWorkers : this.game.workerFactory.idleWorkers, totalWorkers : this.game.workerFactory.workers});
    $('coins-amount').innerHTML = this.game.user.coins;
  }
})

/**
 * @author nomier
 */
var GamePanel = Class.create({
  initialize : function(game){
		this.game = game;
    var self = this;
    $('workers_game_element').observe('click',
                                      function(){
                                        self.game.workerFactory.buyWorker() 
                                      })
	},
	render : function(){
    if(this.game.neighborGame) return;
    var rock = this.game.scene._FormatResourceDisplay(this.game.resources.rock);
    var lumber = this.game.scene._FormatResourceDisplay(this.game.resources.lumber);
    $('rock-amount').innerHTML = this.game.templatesManager.resourceAmountInGamePanel(rock, this.game.quarryFactory.rockPerMinute);
    $('lumber-amount').innerHTML = this.game.templatesManager.resourceAmountInGamePanel(lumber, this.game.lumbermillFactory.lumberPerMinute);
    $('workers-amount').innerHTML = this.game.templatesManager.workersInGamePanel(this.game.workerFactory.idleWorkers, this.game.workerFactory.workers);
    $('coins-amount').innerHTML = this.game.user.coins;
  }
})

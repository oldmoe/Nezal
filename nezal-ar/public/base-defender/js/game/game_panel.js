/**
 * @author nomier
 */
var GamePanel = Class.create({
  initialize : function(game){
		this.game = game
	},
	render : function(){
    if(this.game.neighborGame) return;
    var rock = this.game.scene._FormatResourceDisplay(this.game.resources.rock);
    var iron = this.game.scene._FormatResourceDisplay(this.game.resources.iron);
    $('game-panel').show();
    $('rock-amount').innerHTML = this.game.templatesManager.resourceAmountInGamePanel(rock, this.game.quarryFactory.rockPerMinute);
    $('iron-amount').innerHTML = this.game.templatesManager.resourceAmountInGamePanel(iron, this.game.mineFactory.ironPerMinute);
    $('workers-amount').innerHTML = this.game.workerFactory.idleWorkers + ' / ' + this.game.workerFactory.workers;
    $('coins-amount').innerHTML = this.game.user.coins;
  }
})
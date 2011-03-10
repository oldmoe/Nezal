var AttackManager = Class.create({
	
	initialize: function(game){
    var self = this;
		this.game = game;
    $("sendAttack").stopObserving("click");
    $("sendAttack").observe("click", function(){
      self.simulateAttack();
    });
	},
	simulateAttack : function(){
		var creeps = {}
		for(var i=0;i<5;i++){
			var creep = this.game.creepFactory.newCreep("Car")
			creeps[creep.coords.x+ ":"+creep.coords.y] = "Car"
		}
		this.game.network.simulateAttack(creeps);
	}
})
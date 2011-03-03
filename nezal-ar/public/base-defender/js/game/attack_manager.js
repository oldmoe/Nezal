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
		for(var i=0;i<5;i++){
			this.game.creepFactory.newCreep("Car")
		}
	}
})
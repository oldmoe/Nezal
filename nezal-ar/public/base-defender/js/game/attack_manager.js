var AttackManager = Class.create({
	
	initialize: function(game){
		this.game = game;
	},
	simulateAttack : function(){
		for(var i=0;i<5;i++){
			this.game.creepFactory.newCreep("Car")
		}
	}
})
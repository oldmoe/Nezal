var CreepFactory = Class.create({
  game : null,
  initialize : function(game){
    this.game = game;
		this.registery = []
  },
  
  newCreep : function(type){
		var creepClass = eval(type)
		var creep = new creepClass()
		this.registery.push(creep)
		this.game.scene.push(creep)
		var displayClass = eval(type+"Display")
		var creepDisplay = new displayClass(creep)
		this.game.scene.pushAnimation(creepDisplay);
  }
  
});

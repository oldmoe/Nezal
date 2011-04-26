var CreepFactory = Class.create({
  game : null,
  initialize : function(game){
    this.game = game;
		this.registery = []
  },
  
  newCreep : function(type,id){
		var creepClass = eval(type)
		var creep = new creepClass(this.game)
		creep.id = id
		this.registery.push(creep)
		this.game.scene.push(creep)
		var displayClass = eval(type+"Display")
		var creepDisplay = new displayClass(creep)
		this.game.scene.pushAnimation(creepDisplay)
		return creep
  }, 
	
	remove : function(creep){
		var index = this.registery.indexOf(creep)
		if(index!=-1)this.registery.splice(index,1)
		index = this.game.scene.remove(creep)
    	var explosion = new Explosion(creep);
		var explosionClass = new ExplosionDisplay(explosion);
		creep.destroy()
	}
  
});

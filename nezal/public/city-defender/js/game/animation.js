var Animation = Class.create({
	x : 0,
	y : 0,
	frames : [],
	currentFrame : 0,
	delay : 1,
	delayIndex : 0,
	dx : 20,
	dy : 20,
	
	initialize: function(ctx, x , y){
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.initImages()
	},
	
	initImages : function(){},

	tick : function(){
		this.delayIndex++
		if(this.delayIndex > this.delay){
			this.delayIndex = 0
			this.currentFrame++
			
		}
		if(this.currentFrame >= this.frames.length){
			this.finish();
		}
	},
	
	render : function(){
		this.ctx.drawImage(this.frames[this.currentFrame], this.x-this.dx/2, this.y-this.dy/2)
	},

	finish : function(){
		Game.animations.splice(Game.animations.indexOf(this),1)
	}

})

var CreepBoom = Class.create(Animation, {
	dx : 32,
	dy : 32,
	initImages : function(){
		this.frames = Game.animationFrames.creepBoom
 	} 
})

var NukeBoom = Class.create(Animation, {
	dx : 640,
	dy : 480,
	initImages : function(){
		this.frames = Game.animationFrames.nuke
 	} 	
})

var CoinsAnimation = Class.create(Animation, {
	dx : 16,
	dy : 30,
	initImages : function(){
		this.frames = Game.animationFrames.coins
 	} 	
})


var HealAnimation = Class.create(Animation, {
	dx : 22,
	dy : 44,
	initImages : function(){
		this.frames = Game.animationFrames.heal
 	} 	
})


var Weak = Class.create(Animation, {
	type: 'weak',
	tick : function(){
	},
	
	render : function(){
		Game.allCreeps().each(function(creep){
			creep.ctx.drawImage(Game.images['weak.png'], creep.x - 16, creep.y - 16)
		})
	},
})
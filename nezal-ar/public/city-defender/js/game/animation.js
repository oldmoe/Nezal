var Animation = Class.create({
	x : 0,
	y : 0,
	dead : false,
	currentFrame : 0,
	delay : 1,
	delayIndex : 0,
	dx : 20,
	dy : 20,
	fps : 0,
	score: 0,
	initialize: function(x , y){
		this.frames = []
		this.x = x;
		this.y = y;
		this.initImages()
	},
	
	initImages : function(){},

	tick : function(){
		this.delayIndex++
		if(this.delayIndex >= this.delay){
			this.delayIndex = 0
			this.currentFrame++			
		}
		if(!this.frames[this.currentFrame+'.png']){
			this.finish();
		}
	},
	
	render : function(ctx){
		//console.log(this.currentFrame)
		if(this.frames[this.currentFrame+'.png'])
		ctx.drawImage(this.frames[this.currentFrame+'.png'], this.x-this.dx/2, this.y-this.dy/2)
	},

	finish : function(){
		this.dead = true
		this.layer = null
	}

})

var CreepBoom = Class.create(Animation, {
	dx : 32,
	dy : 32,
	initImages : function(){
		this.frames = Loader.animations.creepBoom
 	} 
})

var NukeBoom = Class.create(Animation, {
	dx : 640,
	dy : 480,
	initImages : function(){
		this.frames = Loader.animations.nuke
 	}
})

var CoinsAnimation = Class.create(Animation, {
	dx : 16,
	dy : 30,
	initImages : function(){
		this.frames = Loader.animations.coins
 	} 	
})


var HealAnimation = Class.create(Animation, {
	dx : 22,
	dy : 44,
	initImages : function(){
		this.frames = Loader.animations.heal
 	} 	
})


var WeakAnimation = Class.create(Animation, {
	type: 'weak',
	tick : function(){
	},
	
	render : function(ctx){
		game.scene.creeps.each(function(creep){
			ctx.drawImage(Loader.images.game['weak.png'], creep.x - 16, creep.y - 16)
		})
	},
})
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
		this.visible = true
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
		this.frames = Loader.animations.creep_boom
 	} 
})

var NukeBoom = Class.create(Animation, {
	dx : 640,
	dy : 480,
	initImages : function(){
		this.frames = Loader.images.nuke_boom
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
		this.frames = Loader.animations.health_point
 	} 	
})

var ArrowAnimation = Class.create(Animation, {
	dx : 0,
	dy : 0,
	increment : 0,
	initImages : function(){
		this.frames = Loader.animations.arrow
 	},
	tick : function(){
		if(this.increment == 60){this.increment = 0;this.x-=60}
			this.x +=3
			this.increment+=3
			this.currentFrame = 1 
	}
})
var VerticalArrowAnimation = Class.create(Animation, {
	dx : 0,
	dy : 0,
	increment : 0,
	initImages : function(){
		this.frames = Loader.animations.vertical_arrow
 	},
	tick : function(){
		if(this.increment == 60){this.increment = 0;this.y-=60}
			this.y +=3
			this.increment+=3
			this.currentFrame = 1 
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
	}
})
var MoneyAnimation = Class.create(Animation, {
	increment : 0,
	initialize: function($super,x,y,money){
		this.money = money
		$super(x,y)
		this.frames = Loader.animations.coins
	},

	initImages : function(){
		this.parent = $('gameElements');
	    this.div = document.createElement('div');
		this.div.innerHTML = "+"+this.money
	    var divIdName = 'moneyAnimation';
	    this.div.setAttribute('id',divIdName);
		this.div.style.position = "absolute"
		this.div.style.top = this.y
		this.div.style.left = this.x
		this.image = Loader.animations.coins[this.currentFrame+'.png']
		this.parent.appendChild(this.div);
		
	},
	tick : function(){
		if(this.increment == 30)this.finish()
			this.increment +=3
			this.y-=3
			this.div.style.top = this.y
	},
	finish : function($super){
		$super()
		this.parent.removeChild(this.div)
	}

})
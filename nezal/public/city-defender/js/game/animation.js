var Animation = Class.create({
	x : 0,
	y : 0,
	frames : [],
	currentFrame : 0,
	delay : 3,
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
		
	render : function(){
		//console.log(this.currentFrame)
		this.ctx.drawImage(this.frames[this.currentFrame], this.x-this.dx/2, this.y-this.dy/2)
		this.delayIndex++
		if(this.delayIndex > this.delay){
			this.delayIndex = 0
			this.currentFrame++
			
		}
		if(this.currentFrame >= this.frames.length){
			this.finish();
		}
	},

	finish : function(){
		Game.animations.splice(Game.animations.indexOf(this),1)
	}

})

var CFrames = []
for(var i=0; i < 17; i++){
	var image = new Image()
	image.src = 'images/animations/creep_boom/'+(i+1)+'.png'
	CFrames.push(image)
	if(i == 10){
		CFrames.push(image)	
		CFrames.push(image)	
	}
	if(i == 11){
		CFrames.push(image)	
		CFrames.push(image)	
	}
	if(i == 15){
		for(var j=0; j < 8; j++){
			CFrames.push(image)	
		}
	}
	if(i == 16){
		for(var j=0; j < 8; j++){
			CFrames.push(image)	
		}
	}
}

var CreepBoom = Class.create(Animation, {
	dx : 32,
	dy : 32,
	initImages : function(){
		this.frames = CFrames
 	} 
})

var NFrames = []
for(var i=0; i < 20; i++){
	var image = new Image()
	image.src = 'images/animations/nuke_boom/'+(i+1)+'.png'
	NFrames.push(image)
}

var NukeBoom = Class.create(Animation, {
	dx : 640,
	dy : 480,
	initImages : function(){
		this.frames = NFrames
 	} 	
})

var CoinFrames = []
for(var i=0; i < 13; i++){
	var image = new Image()
	image.src = 'images/animations/coins/'+(i+1)+'.png'
	CoinFrames.push(image)
}

var CoinsAnimation = Class.create(Animation, {
	dx : 20,
	dy : 40,
	initImages : function(){
		this.frames = CoinFrames
 	} 	
})


var HealFrames = []
for(var i=0; i < 17; i++){
	var image = new Image()
	image.src = 'images/animations/health_point/'+(i+1)+'.png'
	HealFrames.push(image)
}

var HealAnimation = Class.create(Animation, {
	dx : 22,
	dy : 44,
	initImages : function(){
		this.frames = HealFrames
 	} 	
})

var RocketBoom = Class.create(Animation, {
	dx : 20,
	dy : 20,
	initImages : function(){
		var images = [new Image, new Image, new Image]
		images[0].src = 'images/animations/rocket_boom/6.png'
		images[1].src = 'images/animations/rocket_boom/7.png'
		images[2].src = 'images/animations/rocket_boom/8.png'
		this.frames = images
 	} 	
})
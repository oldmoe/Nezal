var Jet = Class.create(Unit, {
	
	initialize: function($super, x, y, scene){
		$super(x, y)
		this.speedx = 5
		this.speedy = 5
		this.scene = scene
	},
	
	tick: function(){
		
		this.x += Math.random() * this.speedx
		this.y += Math.random() * this.speedy
		
		this.checkCollisionDetection();
		
/*		if(Math.random() > 0.5)
			this.x += Math.random() * this.speed
		else
			this.x -= Math.random() * this.speed

		if(Math.random() > 0.5)
			this.y += Math.random() * this.speed
		else
			this.y -= Math.random() * this.speed
	*/},
	
	checkCollisionDetection: function(){
		if(this.x > (this.scene.width-5) || this.x < 60)
			this.speedx = this.speedx * -1
		if(this.y > (this.scene.height-22) || this.y < 20)
			this.speedy = this.speedy * -1
	}
	
});

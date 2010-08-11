var CompositeUnitSprite = Class.create(Sprite, {
	rotation : 0,
	visible : true,
	layer : null,
	cannonRotation : 0,
	initialize : function(images,hp,maxHp, properties){
		this.healthSprite = new HealthSprite(hp,maxHp)
		this.maxHp = maxHp
		this.hp = hp
		Object.extend(this, properties)
		this.images=images;
	},
	setHp : function(hp){
		this.hp = hp
	},
	render : function(ctx){
		try{
		ctx.save();
		ctx.translate(Math.round(this.x), Math.round(this.y))
		ctx.rotate(Math.PI/180 * this.rotation)
		ctx.drawImage(this.images.base, -48, -16)
		ctx.fillStyle = 'red'
		ctx.fillRect(-22, 10, 3, -20)
		ctx.fillStyle = 'green'
		ctx.fillRect(-22, 10, 3, -20*this.hp / this.maxHp)
		//this.healthSprite.render(ctx);
		ctx.translate(-4, 0)
		ctx.rotate(Math.PI/180 * this.cannonRotation)
		if(this.currentFrame ==0)ctx.drawImage(this.images.cannon, -44, -16)	
		else ctx.drawImage(this.images.fire, -44, -16)	
		ctx.restore();
		}catch(e){
			console.log(e)
		}
	},
	
	destroy : function($super){
		this.healthSprite.destroy()
		$super()
	}
})


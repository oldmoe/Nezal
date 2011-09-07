var CompositeUnitSprite = Class.create(Sprite, {
	rotation : 0,
	visible : true,
	layer : null,
	cannonRotation : 0,
	render : function(ctx){
		if(this.owner.dead){
			return this.destroy()
		}
		try{
			ctx.save();
			ctx.translate(Math.round(this.owner.x), Math.round(this.owner.y))
			ctx.rotate(Math.PI/180 * this.owner.rotation)
			ctx.drawImage(this.images.base, -16, -48)
			ctx.translate(-4, 0)
			ctx.rotate(Math.PI/180 * this.owner.cannonTheta)
			if(!this.owner.fired)
				ctx.drawImage(this.images.cannon, -44, -16)	
			else 
				ctx.drawImage(this.images.fire, -44, -16)	
			ctx.restore();
		}catch(e){
			console.log(e)
		}
	}
})

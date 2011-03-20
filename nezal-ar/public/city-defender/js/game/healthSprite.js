var HealthSprite = Class.create(Sprite, {
	layer : null,
	
	initialize : function(owner){
		this.owner = owner
	},
		
	render : function(ctx){
		if(this.owner.dead){
			return this.destroy()
		}
		if(!this.visible) return
		ctx.save()
		//TODO check if it's the same x and the same y before translate
		if(this.rotation != 0){
			ctx.rotate(this.rotation)
		}
		ctx.translate(Math.round(this.owner.x), Math.round(this.owner.y))
		ctx.fillStyle = 'red'
		ctx.fillRect(-16, -22, 32, 3)
		ctx.fillStyle = 'green'
		ctx.fillRect(-16, -22, 32 * this.owner.hp / this.owner.maxHp, 3 )
		ctx.restore()
	}
	
})

var HealthSprite = Class.create(Sprite, {
	layer : null,
	
	initialize : function(hp,maxHp){
		this.hp  = hp
		this.maxHp = maxHp
	},
		

	render : function(ctx){
		if(!this.visible) return
		ctx.save()
		//TODO check if it's the same x and the same y before translate
		if(this.rotation != 0){
			ctx.rotate(this.rotation)
		}
		ctx.translate(Math.round(this.x), Math.round(this.y))
		ctx.fillStyle = 'red'
		ctx.fillRect(-15, -22, 30, 3)
		ctx.fillStyle = 'green'
		ctx.fillRect(-15, -22, 30 * this.hp / this.maxHp, 3 )
		ctx.restore()
	}
	
})

var RangeSprite = Class.create(Sprite, {
	initialize : function(range,owner){
		this.range = range
		this.owner = owner
		this.visible = false
	},
	render:function(ctx){
		if(this.owner.dead){
			return this.destroy()
		}
		ctx.save()
		ctx.translate(Map.transform(this.owner.x)-Map.pitch, Map.transform(this.owner.y))
		ctx.fillStyle = 'rgba(255,255,255,0.5)'
		ctx.beginPath();
		ctx.arc(Map.pitch*1.5, Map.pitch*0.5, (this.owner.range * Map.pitch) + (Map.pitch/2) , 0, Math.PI*2, false)
		ctx.closePath();
		ctx.fill();
		ctx.restore()
	}
})

var RangeSprite = Class.create(Sprite, {
	initialize : function(range){
		this.range = range
		this.visible = false
	},
	render:function(ctx){
			ctx.save()
			ctx.translate(Map.transform(this.x)-Map.pitch, Map.transform(this.y))
			ctx.fillStyle = 'rgba(255,255,255,0.5)'
			ctx.beginPath();
			ctx.arc(Map.pitch*1.5, Map.pitch*0.5, (this.range * Map.pitch) + (Map.pitch/2) , 0, Math.PI*2, false)
			ctx.closePath();
			ctx.fill();
			ctx.restore()
	}
})

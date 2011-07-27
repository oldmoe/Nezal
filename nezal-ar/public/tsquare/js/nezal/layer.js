var Layer = Class.create({
	
	initialize : function(ctx){
		this.ctx = ctx
		this.clear = false
		this.sprites = []
		this.visible = true
	},
		
	attach : function(sprite){
		sprite.layer = this
		this.sprites.push(sprite)
		return this
	},
		
	show : function(){
		this.visible = true
		return this
	},
	
	hide : function(){
		this.visible = false
		return this
	},

	render : function(){
		try{
			if(this.clear){
				this.ctx.clearRect(0, 0, 700, 500)
			}
			if(!this.visible) return
			var remainingSprites = []
			var self = this
			this.sprites.each(function(sprite){
				if(sprite.layer == self){
					if(sprite.visible)sprite.render(self.ctx)
					remainingSprites.push(sprite)
				}
			})
			this.sprites = remainingSprites
		}catch(e){console.log(e)}
		return this
	}

	
})

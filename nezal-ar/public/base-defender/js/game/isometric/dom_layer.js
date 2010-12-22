var DomLayer = Class.create(Layer, {
	
	initialize : function(div){
		this.div = $(div)
		this.visible = true
		this.sprites = [];
	},
		
	attach : function(sprite){
		this.div.appendChild(sprite.div)
		this.sprites.push(sprite)
		sprite.layer = this
		return this
	},
		
	show : function(){
		this.visible = true
		this.div.show();
		return this
	},
	
	hide : function(){
		this.visible = false
		this.div.hide();
		return this
	},

	render : function(){
		try{
			var self = this
			if(!this.visible) return
			var remainingSprites = []
			this.sprites = this.sprites.select(function(sprite){return sprite.layer == self})
			this.sprites.invoke('render')
		}catch(e){console.log(e)}
		return this
	}
})

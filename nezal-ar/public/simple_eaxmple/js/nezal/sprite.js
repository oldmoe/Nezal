var Sprite = Class.create({
	x : 0,
	y : 0,
	w : 0,
	h : 0,
	transitionX: 0,
	transitionY: 0,
    shiftX: 0,
    shiftY: 0,
	rotation : 0,
	visible : true,
	layer : null,
	
	initialize : function(images, owner, properties){
		this.images = images
		this.owner = owner
		Object.extend(this, properties)
		if(images[0]){
			if(!this.w) this.w = images[0].width
			if(!this.h) this.h = images[0].height
		}
		this.currentFrame = 0
		this.draw = true
	},
	
	moveTo : function(x, y){
		this.x = x
		this.y = y
		return this
	},
	
	rotate : function(deg){
		this.rotation = Nezal.degToRad(deg)
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

	render : function(ctx){
		if(this.owner.dead){
			return this.destroy()
		}
		if(!this.visible) return
		ctx.save()
		ctx.translate(this.owner.x+this.shiftX, this.owner.y+this.shiftY)
		if(this.rotation != 0&&this.rotation<360){
			ctx.rotate(this.rotation)
		}
		if(this.draw&&this.images[this.currentFrame]){
			ctx.drawImage(this.images[this.currentFrame],-48+this.transitionX,-16+this.transitionY)
		}
		ctx.restore()

	},
	
	destroy : function(){
		this.layer = null
	}
})


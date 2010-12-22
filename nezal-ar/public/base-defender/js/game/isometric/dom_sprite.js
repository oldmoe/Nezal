var DomSprite = Class.create(Sprite, {
	shiftX : 0,
	shiftY : 0,
	transitionX : 0,
	transitionY : 0,
	rotated : false,
	initialize : function(owner,img,shadeImg, properties){
		this.div = $(document.createElement('DIV'))
		$('gameCanvas').appendChild(this.div)
		this.div.addClassName('DomSprite')
		this.img = img.clone()
		this.shadeImg = shadeImg
		this.owner = owner
		this.div.style.zIndex = this.owner.y + this.owner.zdim
		if (this.owner.inProgress) {
			var progressImg = Loader.images.buildings['progress.png']
			progressImg.style.marginTop = this.owner.imgHeight/2 +"px"
			progressImg.style.marginLeft = this.owner.imgWidth/2 +"px"
			this.div.appendChild(progressImg)
		}
		else {
			this.div.appendChild(this.img)
		}
		this.div.style.width = this.owner.imgWidth
		this.div.style.height = this.owner.imgHeight
		Object.extend(this, properties)
		this.currentAnimationFrame = 0
		this.currentDirectionFrame = 0
	},
	
	show : function(){
		this.visible = true
		this.div.show()
		return this
	},
	
	hide : function(){
		this.visible = false
		this.div.hide()
		return this
	},

	render : function(){
		try{
			if(this.owner.dead){
				return this.destroy()
			}
			
			this.div.style.left = this.owner.coords.x -Math.round(this.owner.imgWidth/2) + "px"
			this.div.style.top = this.owner.coords.y -Math.round(this.owner.imgHeight/2) + "px"
			this.img.style.marginTop = -this.owner.imgHeight*this.owner.angle  + "px"
			this.img.style.marginLeft = -this.currentAnimationFrame * this.owner.imgWidth + "px"
			this.div.style.zIndex = this.owner.coords.y
		}catch(e){
			console.log('Sprite#render: ',e)
		}
	},
	
	destroy : function(){
		console.log('called')
		layer = null
		if(this.div.parentNode){
			this.div = $(this.div.parentNode.removeChild(this.div))
		}
	}
})
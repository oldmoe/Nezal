var DomSprite = Class.create(Sprite, {
	shiftX : 0,
	shiftY : 0,
	transitionX : 0,
	transitionY : 0,
	rotated : false,
	animated : false,
	clickable : false,
	initialize : function(owner,img,shadeImg, properties){
		this.div = $(document.createElement('DIV'))
		$('gameCanvas').appendChild(this.div)
		this.div.addClassName('DomSprite')
		this.img = img.clone()
		this.shadeImg = shadeImg
		this.owner = owner
		this.div.setStyle ({zIndex :(this.owner.coords.y + this.owner.zdim)})
		this.div.appendChild(this.img)
		this.div.style.width = this.owner.imgWidth + "px"
		this.div.style.height =  this.owner.imgHeight + "px"
		Object.extend(this, properties)
		this.currentAnimationFrame = 0
		this.currentDirectionFrame = 0
		this.noOfAnimationFrames = this.img.height/this.owner.imgHeight
		this.noOfDirections = 8
		if(this.clickable){
				this.clickDiv = $(document.createElement('DIV'));
				Map.registerListeners(this.clickDiv,this.owner)
				$('gameCanvas').appendChild(this.clickDiv);
				this.clickDiv.addClassName('DomSprite');
				this.clickDiv.setStyle({zIndex:(this.div.style.zIndex + 1),
																width:this.div.style.width,
																height:this.div.style.height,
																background:"green",
																opacity:0
																})
		}
	},
  
  setImgWidth : function(width){
    this.img.style.width = width + "px";
  },
	
	setStyle : function(style){
		this.div.setStyle(style)
	},
	
	setOpacity : function(opacity){
		this.div.setOpacity(opacity)
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
      
			this.div.setStyle({left : this.owner.coords.x -Math.round(this.owner.imgWidth/2)+this.shiftX + "px",
												 top : this.owner.coords.y -Math.round(this.owner.imgHeight/2)+this.shiftY + "px",
												 zIndex : this.owner.coords.y})
			this.img.setStyle({									 
												 marginLeft :(-this.owner.imgWidth*this.owner.angle  + "px"),
												 marginTop : (-this.currentAnimationFrame * this.owner.imgHeight + "px")})
	
			if (this.clickable) {
				this.clickDiv.setStyle({zIndex :(this.div.style.zIndex + 1),
																left:this.div.style.left,
																top:this.div.style.top});															
	
	  	}
		}catch(e){
			console.log('Sprite#render: ',e)
		}
	},
	
	destroy : function(){
		if(this.div.parentNode){
			this.div = $(this.div.parentNode.removeChild(this.div))
		}
	},
	replaceImg : function(img){
		this.div.removeChild(this.img)
		this.img = img.clone()
		this.div.appendChild(this.img)	
	}
})
var DomImgSprite = Class.create(DomSprite, {
	animated : false,
	clickable : false,
  
	initialize : function($super, owner, imgAssets, properties){
    $super(owner, imgAssets, properties);
		this.img = imgAssets.img.clone()
		this.shadeImg = imgAssets.shadeImg
		this.div.appendChild(this.img)
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
	}
	
})
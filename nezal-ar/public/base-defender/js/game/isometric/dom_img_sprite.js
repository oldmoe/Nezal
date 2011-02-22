var DomImgSprite = Class.create(DomSprite, {
	animated : false,
	clickable : false,
  minAreaZIndex : 10000000,
	initialize : function($super, owner, imgAssets, properties){
    $super(owner, imgAssets, properties);
		this.img = imgAssets.img.clone()
		if(this.img){
			this.img.observe('mousedown',function(event){
				 if(event.preventDefault)
				 {
				  event.preventDefault();
				 }
			})
		}
		this.div.appendChild(this.img)
		this.currentAnimationFrame = 0
		this.currentDirectionFrame = 0
		this.noOfAnimationFrames = this.img.height/this.owner.imgHeight
		this.noOfDirections = 8
		this.img.setStyle({height:"auto"});
		if(this.clickable){
				this.img.setAttribute('usemap','#'+this.owner.coords.x+"-"+this.owner.coords.y)
				this.map = $(document.createElement('map'));
				this.map.setAttribute('name',this.owner.coords.x+"-"+this.owner.coords.y)
				this.clickDiv = $(document.createElement('area'));
				this.clickDiv.setAttribute('shape','poly');
				this.clickDiv.setAttribute('coords', imgAssets.area);
				Map.registerListeners(this.clickDiv,this.owner);
				$('gameCanvas').appendChild(this.map);
				this.map.appendChild(this.clickDiv);
		}
	},
  
  setImgWidth : function(width){
		this.imgWidth = width
    this.img.setStyle({width:(width + "px")});
  },
  
	setImgHeight : function(height){
			this.imgHeight = height
      this.img.setStyle({height:(height + "px")});
  },
	
  replaceImg : function(img){
    this.div.removeChild(this.img)
    this.img = img.clone()
    this.div.appendChild(this.img)  
  },
	
	render : function($super){
    $super();
    this.img.setStyle({
      marginLeft: (-this.owner.imgWidth * this.owner.angle + "px"),
      marginTop: (-this.currentAnimationFrame * this.owner.imgHeight + "px")
    });
    
    if (this.map) {
			this.div.setStyle({
				zIndex: (this.owner.coords.y + this.minAreaZIndex)
			})
    }
  },
  
	destroy : function($super){
		$super()
		if(this.clickDiv && this.clickDiv.parentNode){
			this.clickDiv = $(this.clickDiv.parentNode.removeChild(this.clickDiv))
		}
	}
	
})
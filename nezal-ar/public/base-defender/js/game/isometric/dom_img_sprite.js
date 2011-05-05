var DomImgSprite = Class.create(DomSprite, {
	animated : false,
	clickable : false,
	minAreaZIndex : 10000000,
	initialize : function($super, owner, imgAssets, properties){
    $super(owner, imgAssets, properties);
    //console.log( imgAssets )
		this.img = imgAssets.img.clone()
		if(this.img){
			this.img.observe('mousedown',function(event){
				 if(event.preventDefault)
				 {
				  event.preventDefault();
				 }
			})
		}
    if( imgAssets.shadeImg )
      this.shadeImg = imgAssets.shadeImg.clone();
		this.div.appendChild(this.img)
		this.currentAnimationFrame = 0
		this.currentDirectionFrame = 0
		this.noOfAnimationFrames = this.img.height/this.owner.imgHeight
		this.noOfDirections = 8
		this.img.setStyle({height:"auto"});
		if(this.clickable){
				this.clickDiv =this.img
				Map.registerListeners(this.clickDiv,this.owner);
		}
	},
  
  setCursor : function( style ){
    this.img.setStyle({cursor : style});
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
    
    if (this.clickable) {
			this.div.setStyle({
				zIndex: (this.owner.coords.y + this.minAreaZIndex)
			})
    }else{
      this.img.setStyle({
        marginLeft: (-this.owner.imgWidth * this.owner.angle + "px"),
        marginTop: (-this.currentAnimationFrame * this.owner.imgHeight + "px")
      });
    }
  },
  
	destroy : function($super){
		$super()
		if(this.clickDiv && this.clickDiv.parentNode){
			this.clickDiv = $(this.clickDiv.parentNode.removeChild(this.clickDiv))
		}
	}
	
})

var DomImgSprite = Class.create(DomSprite, {
	animated : false,
	clickable : false,
	minAreaZIndex : 10000000,
    animations : null,
  initialize : function($super, owner, imgAssets, properties){
    this.animations = {}
    this.createAnimation({
        name : 'normal',
        img : $(imgAssets.img),
        noOfFrames : imgAssets.noOfFrames || 1
     })
    this.currentAnimation = this.animations['normal']
    //owner.imgWidth = this.currentAnimation.imgWidth
    //owner.imgHeight = this.currentAnimation.imgHeight
    $super(owner, imgAssets, properties);
    //console.log( imgAssets )
    if(properties && properties.flipped){
      this.div.addClassName('flippedSprite')
    }
    this.img = this.currentAnimation.img
	this.div.appendChild(this.img)
	this.currentAnimationFrame = 0
	this.currentDirectionFrame = 0
	this.noOfAnimationFrames = this.currentAnimation.noOfFrames
	this.noOfDirections = 8
	this.img.setStyle({height:"auto"});
    this.render()
  },
  switchAnimation : function(name){
    var prevAnimation = this.currentAnimation
    this.currentAnimation = this.animations[name]
    this.currentAnimationFrame = 0
    this.currentDirectionFrame = 0
    this.replaceImg(this.currentAnimation.img)
    this.div.style.width = this.currentAnimation.imgWidth + "px"
    this.div.style.height = this.currentAnimation.imgHeight + "px"
    if (this.currentAnimation.flipped)this.flipped = true;
    else this.flipped = false;
    this.img = this.currentAnimation.img
	this.noOfAnimationFrames = this.currentAnimation.noOfFrames
  },
  //options contain {name,noOfFrames, img, imageWidth, imgHeight, direction, startY}
  createAnimation : function(options){
    var img = options.img
    var noOfFrames = options.noOfFrames
    var direction = options.direction || 0
    var startY = options.startY || 0
    var imgWidth = 0
    var imgHeight = 0
    if(direction == 1){
      imgWidth = img.width / noOfFrames
      imgHeight = img.height
    }else{
      imgWidth = img.width
      imgHeight = img.height / noOfFrames
    }
    var flipped = options.flipped || false 
    var animation = {img:img.clone(), noOfFrames : noOfFrames, imgWidth : imgWidth, imgHeight : imgHeight,
    startY:startY, direction:direction,flipped: flipped, name: options.name}
    this.animations[options.name] = animation
    return animation
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
    this.img = img
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
        marginLeft: (-this.currentAnimation.imgWidth * this.owner.angle + "px"),
        marginTop: (-this.currentAnimationFrame * this.currentAnimation.imgHeight + "px")
      });
      if(this.owner.shake){
        Effect.Shake(this.div)
        this.owner.shake = false
      }
      if(this.flipped) Util.flip(this.div)
      else Util.removeTransform(this.div)
      if (this.owner.scene) {
        var scale = ((this.owner.coords.y) / (this.owner.scene.height - this.defaultShiftY)) * 0.8 + 0.5
        this.div.style.WebkitTransform +=' scale(' + scale + ')';
        this.div.style.MozTransform +=' scale(' + scale + ')';
      }
    }
    
  },
  
	destroy : function($super){
		$super()
		if(this.clickDiv && this.clickDiv.parentNode){
			this.clickDiv = $(this.clickDiv.parentNode.removeChild(this.clickDiv))
		}
	}
	
})

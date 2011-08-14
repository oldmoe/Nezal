var Background = Class.create({
	
	initialize: function(scene, options){
		this.imagesCount = options.imagesCount
		this.scene = scene
		this.speed = options.speed
		this.images = options.images
    if(options.alwaysMove) this.alwaysMove = true
		this.y = options.y || 0
		this.container = $(document.createElement('div'))
		$("container").appendChild(this.container)
		this.container.addClassName('skyline')
			
		var maxWidth = this.images[0].width
		for(var i=1; i<this.images.length; i++){
			if( maxWidth < this.images[i].width)
				maxWidth = this.images[i].width	
		}
    this.offsetX = -Math.round(Math.random()*maxWidth)
		this.container.setStyle({width:(maxWidth*this.imagesCount)+"px", top:this.y+"px"})
		for(var i=0;i<this.imagesCount;i++){
			this.container.appendChild(this.images.random().clone())
		}
    this.render(true)
	},
	
	render: function(forceRender){
    if(this.scene.moving || this.alwaysMove|| forceRender)
		this.container.children[0].setStyle({marginLeft:this.offsetX+"px"})
	},
	
	tick : function(){
    if(!this.scene.moving && !this.alwaysMove)return
    if(!this.scene.moveBack){
  		this.offsetX -= this.speed()
  		var firstImg = this.container.children[0]
  		if(firstImg.getWidth()+this.offsetX <= 0){
  			this.reset()
  		}
    }else{
      if (this.offsetX > 0) {
        this.offsetX =-this.speed() 
      }else if(this.offsetX == 0){
        this.reset()
      }
      this.offsetX+=this.speed()
    }
	},
	
	reset : function(){
    if (!this.scene.moveBack) {
      this.offsetX = 0
      this.container.removeChild(this.container.children[0])
      this.container.appendChild(this.images.random().clone())
    }else{
      this.offsetX = -this.images[0].width
      if(this.container.children.length>0)this.container.removeChild(this.container.children[this.container.children.length-1])
      if(this.container.children.length>0)this.container.children[0].insert({before:this.images.random().clone()})
    }
	}
	
});
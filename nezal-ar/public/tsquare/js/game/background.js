var Background = Class.create({
	
	initialize: function(scene, options){
		this.imagesCount = options.imagesCount
		this.scene = scene
		this.speed = options.speed
		this.images = options.images
		this.y = options.y || 0
		console.log(this.images)
		this.container = document.createElement('div')
		$("container").appendChild(this.container)
		this.container.addClassName('skyline')
		this.offsetX = 0
			
		var maxWidth = this.images[0].width
		for(var i=1; i<this.images.length; i++){
			if( maxWidth < this.images[i].width)
				maxWidth = this.images[i].width	
		}

		this.container.setStyle({width:(maxWidth*this.imagesCount)+"px", top:this.y+"px"})
		for(var i=0;i<this.imagesCount;i++){
			this.container.appendChild(this.images.random().clone())
		}
	},
	
	render: function(){
		this.container.children[0].setStyle({marginLeft:this.offsetX+"px"})
	},
	
	tick : function(){
		this.offsetX -= this.speed
		var firstImg = this.container.children[0]
		if(firstImg.getWidth()+this.offsetX <= 0){
			this.reset()
		}
	},
	
	reset : function(){
		this.offsetX =0
	    this.container.removeChild(this.container.children[0])
	    this.container.appendChild(this.images.random().clone())
	}
	
});
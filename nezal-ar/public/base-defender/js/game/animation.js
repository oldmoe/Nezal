var Animation = {

  show : function(div){
    Effect.Grow(div, {duration : 0.3});
  },

  hide : function(div){
    Effect.Shrink(div, {duration:0.3});
  }

}
var ObjAnimation = Class.create({
	x : 0,
	y : 0,
	imgWidth :0,
	imgHeight:0,
	currentFrame : 0,
	initialize: function(x , y,owner, noOfFrames){
		this.x = x;
		this.y = y;
		this.initImages()
		this.sprite = new DomImgSprite(owner,{img:this.img})
	},
	
	initImages : function(){},

	tick : function(){
			this.sprite.currentAnimationFrame++			
	},
	
	render : function(){
			this.sprite.render()
			if(this.currentFrame == )
	},

	finish : function(){
		
	}

})

var CreepBoom = Class.create(ObjAnimation, {
	dx : 32,
	dy : 32,
	initImages : function(){
		this.img = Loader.animations.creep_boom
 	} 
})



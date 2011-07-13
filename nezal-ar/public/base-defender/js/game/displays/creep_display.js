var CreepDisplay = Class.create(Display,{
  imgWidth : 0,
  imgHeight : 0,
  xdim : 0,
  ydim : 0,
  zdim : 0,
  hitFrames : 0,
  hitFramesIncreasing : true,
  initialize: function($super, owner, properties,name){
    $super(owner, properties);
    this.owner.owner
    this.img = Loader.images.creeps[name+'.png']
	  this.hitImage = Loader.images.creeps[name+'_fight.png']
    Object.extend(this.owner,this);
    this.sprites.body = new DomImgSprite(owner, {img: this.img});
	  this.sprites.hitting = new DomImgSprite(owner, {img: this.hitImage});
    //this.sprites.skeleton = new DomSkeleton(owner)
    this.sprites.health = new DomMeterSprite(this.owner,{width:20, height:5,hideWhenFull:true,styleClass:{empty:'healthEmpty',full:'healthFull'}})
    this.sprites.health.shiftY =3
  	var self = this
  	this.startedHitting = false
  	this.owner.startHittingObservers.push(function(){self.hit()})
  	this.owner.finishHittingObservers.push(function(){self.endHit()})
  },
  
  render : function(){
  	if(this.owner.hitting){
      this.renderHit()
  	} else if(this.owner.moving){
  	  this.startedHitting = false
      this.sprites.body.currentAnimationFrame = (this.sprites.body.currentAnimationFrame+1)% this.sprites.body.noOfAnimationFrames 
    }
    this.sprites.body.render()
    this.sprites.health.render()
  },
  hit : function(){
    this.startedHitting = true
    this.sprites.body.replaceImg(this.hitImage)
  },
  endHit : function(){
	  this.startedHitting = false
	  this.sprites.body.replaceImg(this.img)
  },
  renderHit : function(){
  	if(this.sprites.body.currentAnimationFrame == 0) this.hitFramesIncreasing = true
  	if(this.sprites.body.currentAnimationFrame == this.hitFrames-1) this.hitFramesIncreasing = false
    	if(this.hitFramesIncreasing){
    		this.sprites.body.currentAnimationFrame = (this.sprites.body.currentAnimationFrame + 1);	
    	} else {
    		this.sprites.body.currentAnimationFrame = (this.sprites.body.currentAnimationFrame - 1);
    	}
  }
  
});

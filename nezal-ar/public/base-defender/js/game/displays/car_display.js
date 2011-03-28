var CarDisplay = Class.create(Display,{
  imgWidth : 108,
  imgHeight : 93,
  xdim : 64,
  ydim : 93,
  zdim : 10,
  hitFrames : 6,
  hitFramesIncreasing : true,
  initialize: function($super, owner, properties){
    $super(owner, properties);
    this.owner.owner
    this.img = Loader.images.creeps['car.png']
	this.hitImage = Loader.images.creeps['car_fight.png']
    Object.extend(this.owner,this);
    this.sprites.body = new DomImgSprite(owner, {img: this.img});
	this.sprites.hitting = new DomImgSprite(owner, {img: this.hitImage});
    //this.sprites.skeleton = new DomSkeleton(owner)
    this.sprites.health = new DomHealthSprite(this.owner,{healthWidth:20, healthHeight:5})
    this.sprites.health.shiftY =3
	var self = this
	this.startedHitting = false
	this.owner.startHittingObservers.push(function(){self.hit()})
	this.owner.finishHittingObservers.push(function(){self.endHit()})
  },
  
  render : function(){
  	if(this.owner.hitting){
		this.renderHit()
	}
    else if(this.owner.moving){
	  this.startedHitting = false
      this.sprites.body.currentAnimationFrame =(this.sprites.body.currentAnimationFrame+1)% this.sprites.body.noOfAnimationFrames 
    }
    this.sprites.body.render()
    this.sprites.health.render()
  },
  hit : function(){
  	this.startedHitting = true
	this.sprites.body.replaceImg(Loader.images.creeps['car_fight.png'])
  },
  endHit : function(){
	this.startedHitting = false
	this.sprites.body.replaceImg(Loader.images.creeps['car.png'])
  },
  renderHit : function(){
  	if(this.sprites.body.currentAnimationFrame==0)this.hitFramesIncreasing=true
	if(this.sprites.body.currentAnimationFrame==this.hitFrames-1)this.hitFramesIncreasing=false
  	if(this.hitFramesIncreasing){
		this.sprites.body.currentAnimationFrame = (this.sprites.body.currentAnimationFrame + 1);	
	}else{
		this.sprites.body.currentAnimationFrame = (this.sprites.body.currentAnimationFrame - 1);
	}
	 
  }
  
  
});

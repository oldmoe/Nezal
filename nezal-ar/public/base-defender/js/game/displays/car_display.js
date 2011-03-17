var CarDisplay = Class.create(Display,{
  imgWidth : 64,
  imgHeight : 93,
  xdim : 64,
  ydim : 93,
  zdim : 0,
  initialize: function($super, owner, properties){
    $super(owner, properties);
    this.owner.owner
    this.img = Loader.images.creeps['car.png']
    Object.extend(this.owner,this);
    this.sprites.body = new DomImgSprite(owner, {img: this.img});
    //this.sprites.body.shiftX = this.imgWidth/2
    //this.sprites.body.shiftY = this.imgHeight/2
    //this.sprites.skeleton = new DomSkeleton(owner)
    this.sprites.health = new DomHealthSprite(this.owner,{healthWidth:20, healthHeight:5})
    this.sprites.health.shiftY =3
  },
  
  render : function(){
    if(this.owner.moving){
      this.sprites.body.currentAnimationFrame =(this.sprites.body.currentAnimationFrame+1)% this.sprites.body.noOfAnimationFrames 
    }
    this.sprites.body.render()
    this.sprites.health.render()
  },
  
  
});

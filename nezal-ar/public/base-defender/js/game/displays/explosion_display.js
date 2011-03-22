var Explosion = Class.create({

  imgWidth : 60,
  imgHeight : 60,
  xdim : 64,
  ydim : 62,
  zdim : 0,

  initialize : function(owner) {
    this.owner = owner;
    this.coords = this.owner.coords;
    this.coords.x = this.coords.x ;
    this.coords.y = this.coords.y + this.owner.imgHeight/2 - this.imgHeight/2;
    this.game = this.owner.game;
    this.angle = 0;
  }

});

var ExplosionDisplay = Class.create(Display,{

  initialize: function($super, owner, properties){
    $super(owner, properties);
    this.owner = owner;
    this.angle = 0;
    this.img = Loader.images.creeps['explosion.png']
    this.sprites.explosion = new DomImgSprite(owner, {img: this.img});
    this.sprites.explosion.shiftY =3;
		this.owner.game.scene.pushAnimation(this);
  },
  
  render : function(){
    this.sprites.explosion.render();
    this.owner.angle += 1;
    if(this.owner.angle == 16) 
    {
      this.owner.game.scene.removeAnimation(this);
    }
  }
  
});

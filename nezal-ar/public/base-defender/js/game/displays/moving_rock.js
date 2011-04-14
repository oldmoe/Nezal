var MovingRock = Class.create({
    
  moveRatio : 10,
  attacker : null,
  imgHeight : 15,
  imgWidth : 15,
  width : 15,
  height : 15,
  zdim : 32,

  initialize : function(owner) {
    this.owner = owner;
    this.extraXStep = 0;
    this.extraYStep = 0;
    this.distance = 20;
    this.coords = { x : 0, y : 0};
    this.coords.x = this.owner.coords.x + this.owner.position2[this.owner.owner.angle].x + this.extraXStep - this.owner.owner.imgWidth/2 + this.imgWidth/2;
    this.coords.y = this.owner.coords.y + this.owner.position2[this.owner.owner.angle].y + this.extraYStep - this.owner.owner.imgHeight/2 + this.imgHeight/2;
    this.attacker = null;
    var self = this;
    this.rockImg = Loader.images.weapons[this.owner.owner.owner.shot + '.png'];
    this.display =  new DomImgSprite(this, {img: this.rockImg});
    this.id = parseInt(Math.random() * 10000);
    this.attacker = this.owner.owner.attacker;
    this.extraXStep = 0;this.coords.x
    this.extraYStep = 0;
//    this.tick();
//    console.log("New Rock :: ", this.id, " :: ",  this.coords.x, " :: ", this.coords.y, " :: ", this.owner.owner.angle);
  },

  tick : function() {
    if(this.attacker) {
      var targetX = this.attacker.coords.x;
      var targetY = this.attacker.coords.y + this.attacker.imgHeight/8;
      var move = Util.getNextMove(this.coords.x, this.coords.y, targetX, targetY, this.distance)
      this.extraXStep = move[0];
      this.extraYStep = move[1];
      if( Math.abs(this.extraXStep) > Math.abs(targetX - this.coords.x))
        this.extraXStep = targetX - this.coords.x
      if( Math.abs(this.extraYStep) > Math.abs(targetY - this.coords.y))
        this.extraYStep = targetY - this.coords.y
      this.coords.x = this.coords.x + this.extraXStep;
      this.coords.y = this.coords.y + this.extraYStep;
      this.display.render();
//      console.log("Rock Tick ", this.id," :: ", this.attacker.id, " :: ", this.attacker.coords.x, " :: ", this.attacker.coords.y, " :: ",  this.coords.x, " :: ", this.coords.y)
      if(this.coords.x == targetX && this.coords.y == targetY )
      {
        this.attacker.hp -= this.owner.owner.specs.power;
//        console.log("=============================== FIREEEEEE =========================", this.attacker.hp);
        this.destroy();
      }
    }else {
      this.destroy();
    }
  },

  destroy : function() {
    this.attacker = null;
    this.display.destroy();
    this.owner.display.movingRocks.remove(this);
  }
    
});


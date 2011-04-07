var MovingGreenBook = Class.create(MovingRock, {

  imgHeight : 30,
  imgWidth : 25,
  width : 25,
  height : 30,
  zdim : 34,
  
  inizialize : function($super){
    $super();
  },

  tick : function($super){
    this.angle = this.owner.angle;
    this.display.currentAnimationFrame = (this.display.currentAnimationFrame + 1)%8
    $super();
  }

});

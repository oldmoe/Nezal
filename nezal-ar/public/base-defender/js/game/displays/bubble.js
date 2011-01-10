var Bubble = Class.create({
  initialize : function(coords , largeSizeLimit){
    this.coords = coords;
    this.imgWidth = 110;
    this.imgHeight = 40;
    this.xdim = 110;
    this.ydim = 40;
    this.zdim = 0;
    this.reset();
  },
  reset : function(){
    this.xMovement = 0;
    this.yMovement = 0;
    this.size = 10;
    this.xDirection = 1//Math.randomSign()
  }
});
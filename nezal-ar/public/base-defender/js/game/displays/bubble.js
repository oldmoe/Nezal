var Bubble = Class.create({
  initialize : function(coords , largeSizeLimit){
    this.coords = coords;
    this.imgWidth = largeSizeLimit;
    this.imgHeight = largeSizeLimit;
    this.xdim = largeSizeLimit;
    this.ydim = largeSizeLimit;
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
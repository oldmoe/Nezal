var Bubble = Class.create({
  initialize : function(coords , largeSizeLimit){
    this.coords = coords;
    this.imgWidth = 110;
    this.imgHeight = 40;
    this.angle=0
    this.xdim = 110;
    this.ydim = 40;
    this.zdim = 0;
    if(largeSizeLimit && largeSizeLimit.width)
      this.imgWidth = largeSizeLimit.width;
    if(largeSizeLimit && largeSizeLimit.height)
      this.imgHeight = largeSizeLimit.height;
    this.reset();
  },
  reset : function(){
    this.xMovement = 0;
    this.yMovement = 0;
    this.size = 10;
    this.xDirection = 1//Math.randomSign()
  }
});

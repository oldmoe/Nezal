var AxeDisplay = Class.create(CreepDisplay,{
  imgWidth : 108,
  imgHeight : 93,
  xdim : 64,
  ydim : 93,
  zdim : 10,
  hitFrames : 6,
  hitFrames : 6,
  hitFramesIncreasing : true,
  initialize: function($super, owner, properties){
    $super(owner, properties,owner.name);
  }
});

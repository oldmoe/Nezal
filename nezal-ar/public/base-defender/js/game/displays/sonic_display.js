var SonicDisplay = Class.create(CreepDisplay,{
 imgWidth : 87,
  imgHeight : 75,
  xdim : 64,
  ydim : 93,
  zdim : 10,
  hitFrames : 6,
  hitFramesIncreasing : true,
  initialize: function($super, owner, properties){
    alert(owner.name)
    $super(owner, properties,owner.name);
  }
});

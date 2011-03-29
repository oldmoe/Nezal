var Worker = Class.create(MovingObject,{
	initialize: function($super,game, x, y){
  	$super(game, x, y)
	//this.speed = this.distanceToNextTile/24
	this.speed = 1.4905461176219506
  },
  tick : function($super){
	$super()
  }	
});
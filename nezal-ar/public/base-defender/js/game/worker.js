var Worker = Class.create(MovingObject,{
	initialize: function($super,game, x, y){
  	$super(game, x, y)
		this.speed = this.distanceToNextTile/24
  },
	tick : function($super){
		$super()
		this.speed = this.distanceToNextTile/24;
	}	
});
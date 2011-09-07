var Humvee = Class.create(Unit, {
	
	initialize: function($super, x, y, jet){
		$super(x,y)
		this.jet = jet
		this.cannonTheta = 0
		this.rotation = 0
	}
	
	
	
});

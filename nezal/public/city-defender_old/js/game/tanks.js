var Humvee = Class.create(Creep, {
	cannonDisplacement : [-1, 1],
	images : {
		base : cityDefenderImages['humvee_body.png'],
		cannon : cityDefenderImages['humvee_tower.png'],
		fire : cityDefenderImages['humvee_tower_in_action.png'],
		trace : [ cityDefenderImages['humvee_trace_100.png'], 
		          cityDefenderImages['humvee_trace_50.png'],
		          cityDefenderImages['humvee_trace_20.png'],
	          ]
	},
	
	initTraces : function(){
	}
})

var Tank = Class.create(Creep,{
	images : {
		base : new Image(),
		cannon : new Image(),
		fire : new Image(),
		trace : [new Image(), new Image(), new Image()]
	},
})

var TankI = Class.create(Creep, {
	images : {
		base : cityDefenderImages['tank_1_2_body.png'],
		cannon : cityDefenderImages['tank_1_tower.png'],
		fire : cityDefenderImages['tank_1_tower_in_action.png'],
		trace : [new Image(), new Image(), new Image()]
	},
})

var TankII = Class.create(Creep, {
	images : {
		base : cityDefenderImages['tank_1_2_body.png'],
		cannon : cityDefenderImages['tank_2_tower.png'],
		fire : cityDefenderImages['tank_2_tower_in_action.png'],
		trace : [new Image(), new Image(), new Image()]
	},
})

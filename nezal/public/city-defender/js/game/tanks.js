var Humvee = Class.create(Creep, {
	cannonDisplacement : [-1, 1],
	images : {
		base : Game.images['humvee_body.png'],
		cannon : Game.images['humvee_tower.png'],
		fire : Game.images['humvee_tower_in_action.png'],
	}
})

var Tank = Class.create(Creep,{
	images : {
		base : Game.images['tank_body.png'],
		cannon : Game.images['tank_tower.png'],
		fire : Game.images['tank_tower_in_action.png'],
	}
})

var TankI = Class.create(Creep, {
	images : {
		base : Game.images['tank_1_2_body.png'],
		cannon : Game.images['tank_1_tower.png'],
		fire : Game.images['tank_1_tower_in_action.png'],
	}
})

var TankII = Class.create(Creep, {
	images : {
		base : Game.images['tank_1_2_body.png'],
		cannon : Game.images['tank_2_tower.png'],
		fire : Game.images['tank_2_tower_in_action.png'],
	}
})

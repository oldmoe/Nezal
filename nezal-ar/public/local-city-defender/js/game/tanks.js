var Humvee = Class.create(Creep, {
  name : 'Humvee',
	cannonDisplacement : [-1, 1],
	images : {
		base : Game.images['humvee_body.png'],
		cannon : Game.images['humvee_tower.png'],
		fire : Game.images['humvee_tower_in_action.png'],
	}
})

var Tank = Class.create(Creep,{
  name : 'Tank',
	images : {
		base : Game.images['tank_body.png'],
		cannon : Game.images['tank_tower.png'],
		fire : Game.images['tank_tower_in_action.png'],
	}
})

var TankI = Class.create(Creep, {
  name : 'TankI',
	images : {
		base : Game.images['tank_1_body.png'],
		cannon : Game.images['tank_1_tower.png'],
		fire : Game.images['tank_1_tower_in_action.png'],
	}
})

var TankII = Class.create(Creep, {
  name : 'TankII',
	images : {
		base : Game.images['tank_2_body.png'],
		cannon : Game.images['tank_2_tower.png'],
		fire : Game.images['tank_2_tower_in_action.png'],
	}
})

var BlackTank = Class.create(Creep,{
  name : 'BlackTank',
	images : {
		base : Game.images['black_tank_body.png'],
		cannon : Game.images['black_tank_tower.png'],
		fire : Game.images['black_tank_tower_in_action.png'],
	}
})

var RedTank = Class.create(Creep,{
  name : 'RedTank',
	images : {
		base : Game.images['red_tank_body.png'],
		cannon : Game.images['red_tank_tower.png'],
		fire : Game.images['red_tank_tower_in_action.png'],
	}
})

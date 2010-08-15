var Humvee = Class.create(Creep, {
  name : 'Humvee',
	cannonDisplacement : [-1, 1],
	images : {
		base : Loader.images.game['humvee_body.png'],
		cannon : Loader.images.game['humvee_tower.png'],
		fire : Loader.images.game['humvee_tower_in_action.png'],
	}
})

var Tank = Class.create(Creep,{
  name : 'Tank',
	images : {
		base : Loader.images.game['tank_body.png'],
		cannon : Loader.images.game['tank_tower.png'],
		fire : Loader.images.game['tank_tower_in_action.png'],
	}
})

var TankI = Class.create(Creep, {
  name : 'TankI',
	images : {
		base : Loader.images.game['tank_1_body.png'],
		cannon : Loader.images.game['tank_1_tower.png'],
		fire : Loader.images.game['tank_1_tower_in_action.png'],
	}
})

var TankII = Class.create(Creep, {
  name : 'TankII',
	images : {
		base : Loader.images.game['tank_2_body.png'],
		cannon : Loader.images.game['tank_2_tower.png'],
		fire : Loader.images.game['tank_2_tower_in_action.png'],
	}
})

var BlackTank = Class.create(Creep,{
  name : 'BlackTank',
	images : {
		base : Loader.images.game['black_tank_body.png'],
		cannon : Loader.images.game['black_tank_tower.png'],
		fire : Loader.images.game['black_tank_tower_in_action.png'],
	}
})

var RedTank = Class.create(Creep,{
  name : 'RedTank',
	images : {
		base : Loader.images.game['red_tank_body.png'],
		cannon : Loader.images.game['red_tank_tower.png'],
		fire : Loader.images.game['red_tank_tower_in_action.png'],
	}
})

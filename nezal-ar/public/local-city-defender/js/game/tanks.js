var Humvee = Class.create(Creep, {
  name : 'Humvee',
	cannonDisplacement : [-1, 1],
	images : {},
	initImages : function(){
		this.images = {
			base : Loader.images.game['humvee_body.png'],
			cannon : Loader.images.game['humvee_tower.png'],
			fire : Loader.images.game['humvee_tower_in_action.png'],
		}
	}
})

var Tank = Class.create(Creep,{
  name : 'Tank',
  images : {},
  initImages : function(){
		this.images = {
			base : Loader.images.game['tank_body.png'],
			cannon : Loader.images.game['tank_tower.png'],
			fire : Loader.images.game['tank_tower_in_action.png'],
		}
	}
})

var TankI = Class.create(Creep, {
  images : {},
  name : 'TankI',
  initImages : function(){
	this.images = {
		base : Loader.images.game['tank_1_body.png'],
		cannon : Loader.images.game['tank_1_tower.png'],
		fire : Loader.images.game['tank_1_tower_in_action.png'],
	}
  }
})

var TankII = Class.create(Creep, {
  images : {},
  name : 'TankII',
  initImages : function(){
	this.images = {
		base : Loader.images.game['tank_2_body.png'],
		cannon : Loader.images.game['tank_2_tower.png'],
		fire : Loader.images.game['tank_2_tower_in_action.png'],
	}
  }
})

var BlackTank = Class.create(Creep,{
  images : {},
  name : 'BlackTank',
  initImages : function(){
	this.images = {
		base : Loader.images.game['black_tank_body.png'],
		cannon : Loader.images.game['black_tank_tower.png'],
		fire : Loader.images.game['black_tank_tower_in_action.png'],
	}
	}
})

var RedTank = Class.create(Creep,{
  images : {},
  name : 'RedTank',
  initImages : function(){
	this.images = {
		base : Loader.images.game['red_tank_body.png'],
		cannon : Loader.images.game['red_tank_tower.png'],
		fire : Loader.images.game['red_tank_tower_in_action.png'],
	}
	}
})
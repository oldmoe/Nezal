var Humvee = Class.create(Creep, {
  name : 'Humvee',
  price : 2,
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
  price : 1,
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
   price : 1,
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
  price : 2,
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
  price : 50,
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
  price : 3,
  initImages : function(){
	this.images = {
		base : Loader.images.game['red_tank_body.png'],
		cannon : Loader.images.game['red_tank_tower.png'],
		fire : Loader.images.game['red_tank_tower_in_action.png'],
	}
	}
})

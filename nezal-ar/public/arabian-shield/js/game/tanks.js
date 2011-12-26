var Humvee = Class.create(Creep, {
    name : 'Humvee',
	hp : 275 , maxHp : 275,speed : 4,
     price : 2,
    cannonDisplacement : [-1, 1]
})

var Tank = Class.create(Creep,{
  name : 'Tank',
  images : {},
  price : 1,
	power : 1,
  hp : 150 , maxHp : 150
})

var TankI = Class.create(Creep, {
  images : {},
  name : 'TankI',
   price : 1,
	hp : 275,maxHp : 275
})

var TankII = Class.create(Creep, {
  images : {},
  name : 'TankII',
  price : 1,
  speed : 8,
  hp : 250,maxHp : 250
})

var BlackTank = Class.create(Creep,{
  images : {},
  name : 'BlackTank',
  price : 40,
	hp : 4000,maxHp : 4000,
	speed : 2,power : 3
})

var RedTank = Class.create(Creep,{
  images : {},
  name : 'RedTank',
  price : 2,
  power : 2,
  hp : 175, maxHp : 175
})

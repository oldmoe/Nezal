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
	power : 1
})

var TankI = Class.create(Creep, {
  images : {},
  name : 'TankI',
   price : 1,
	hp : 225,maxHp : 225
})

var TankII = Class.create(Creep, {
  images : {},
  name : 'TankII',
  price : 2,
  speed : 8,
  hp : 225,maxHp : 225
})

var BlackTank = Class.create(Creep,{
  images : {},
  name : 'BlackTank',
  price : 40,
	hp : 3000,maxHp : 3000,
	speed : 2,power : 3
})

var RedTank = Class.create(Creep,{
  images : {},
  name : 'RedTank',
  price : 3,
  power : 2,
  hp : 150, maxHp : 150
})

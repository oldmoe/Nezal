var Config = {
	delay : 2000, //delay between waves, in milliseconds
	towers : [
		{ klass : Turret, name : 'Basic', values : {hp:300, power:5, rate:0.1, price: 10, range: 2} },
		{ klass : DoubleTurret, name : 'Double', values : {hp:600, power:10, rate:0.2, price: 30, range: 2} },
		{ klass : Patriot, name : 'Patriot Air Defense', values : {hp:1000, power:15, rate:0.3, price: 60, range: 3} },
		{ klass : RocketLauncher, name : 'Rocket Launcher', values : {hp:800, power:100, rate:0.05, price: 50, range: 2} }
	],
	waves : [

		{ creeps : [
			{klass : Humvee, count : 1, values : {hp:15000, speed:4, power:3, rate:0.1, price: 100, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 10, values : {hp:650, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankII, count : 10, values : {hp:680, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : Tank, count : 10, values : {hp:620, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankI, count : 10, values : {hp:650, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 20, values : {hp:120, speed:8, power:3, rate:0.1, price: 4, range: 3} }
		] },
		{ creeps : [
			{klass : TankII, count : 5, values : {hp:600, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Humvee, count : 5, values : {hp:620, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Plane, count : 10, values : {hp:120, speed:8, power:3, rate:0.1, price: 4, range: 3} }
		] },
		{ creeps : [
			{klass : TankI, count : 5, values : {hp:580, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankII, count : 5, values : {hp:600, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Plane, count : 10, values : {hp:120, speed:8, power:3, rate:0.1, price: 4, range: 3} }
		] },
		{ creeps : [
			{klass : Tank, count : 5, values : {hp:560, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankI, count : 5, values : {hp:580, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Plane, count : 10, values : {hp:120, speed:8, power:3, rate:0.1, price: 4, range: 3} }
		] },
		{ creeps : [
			{klass : TankI, count : 5, values : {hp:540, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankII, count : 5, values : {hp:560, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Humvee, count : 5, values : {hp:580, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Plane, count : 5, values : {hp:120, speed:8, power:3, rate:0.1, price: 4, range: 3} }
		] },
		{ creeps : [
			{klass : Tank, count : 5, values : {hp:520, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankI, count : 5, values : {hp:540, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankII, count : 5, values : {hp:560, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Plane, count : 5, values : {hp:120, speed:8, power:3, rate:0.1, price: 4, range: 3} }
		] },
		{ creeps : [
			{klass : Tank, count : 5, values : {hp:500, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankI, count : 5, values : {hp:520, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankII, count : 5, values : {hp:540, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Humvee, count : 5, values : {hp:560, speed:8, power:3, rate:0.1, price: 4, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 10, values : {hp:100, speed:8, power:3, rate:0.1, price: 4, range: 3} },
			{klass : Humvee, count : 10, values : {hp:500, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 10, values : {hp:480, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankII, count : 5, values : {hp:500, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Humvee, count : 5, values : {hp:520, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : Tank, count : 10, values : {hp:460, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankI, count : 5, values : {hp:480, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankII, count : 5, values : {hp:500, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 20, values : {hp:460, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 10, values : {hp:430, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : Humvee, count : 10, values : {hp:460, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 20, values : {hp:430, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 10, values : {hp:400, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankII, count : 10, values : {hp:430, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 20, values : {hp:400, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : Tank, count : 10, values : {hp:380, speed:8, power:2, rate:0.1, price: 3, range: 2} },
			{klass : TankI, count : 10, values : {hp:400, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : Tank, count : 20, values : {hp:380, speed:8, power:2, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 1, values : {hp:6000, speed:2, power:3, rate:0.1, price: 50, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 10, values : {hp:350, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : TankII, count : 10, values : {hp:380, speed:4, power:1, rate:0.1, price: 2, range: 2} }
		] },
		{ creeps : [
			{klass : Tank, count : 10, values : {hp:320, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : TankI, count : 10, values : {hp:350, speed:4, power:1, rate:0.1, price: 2, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 20, values : {hp:300, speed:4, power:2, rate:0.1, price: 2, range: 3} }
		] },
		{ creeps : [
			{klass : TankII, count : 5, values : {hp:300, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : Humvee, count : 5, values : {hp:320, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : Plane, count : 10, values : {hp:350, speed:4, power:2, rate:0.1, price: 2, range: 3} }
		] },
		{ creeps : [
			{klass : TankI, count : 5, values : {hp:280, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : TankII, count : 5, values : {hp:300, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : Plane, count : 10, values : {hp:60, speed:4, power:2, rate:0.1, price: 2, range: 3} }
		] },
		{ creeps : [
			{klass : Tank, count : 5, values : {hp:260, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : TankI, count : 5, values : {hp:280, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : Plane, count : 10, values : {hp:60, speed:4, power:2, rate:0.1, price: 2, range: 3} }
		] },
		{ creeps : [
			{klass : TankI, count : 5, values : {hp:240, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : TankII, count : 5, values : {hp:260, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : Humvee, count : 5, values : {hp:280, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : Plane, count : 5, values : {hp:60, speed:4, power:2, rate:0.1, price: 2, range: 3} }
		] },
		{ creeps : [
			{klass : Tank, count : 5, values : {hp:220, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : TankI, count : 5, values : {hp:240, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : TankII, count : 5, values : {hp:260, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : Plane, count : 5, values : {hp:60, speed:4, power:2, rate:0.1, price: 2, range: 3} }
		] },
		{ creeps : [
			{klass : Tank, count : 5, values : {hp:200, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : TankI, count : 5, values : {hp:220, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : TankII, count : 5, values : {hp:240, speed:4, power:1, rate:0.1, price: 2, range: 2} },
			{klass : Humvee, count : 5, values : {hp:260, speed:4, power:1, rate:0.1, price: 2, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 10, values : {hp:60, speed:4, power:2, rate:0.1, price: 2, range: 3} },
			{klass : Humvee, count : 10, values : {hp:200, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 10, values : {hp:160, speed:4, power:1, rate:0.1, price: 1, range: 2} },
			{klass : TankII, count : 5, values : {hp:180, speed:4, power:1, rate:0.1, price: 1, range: 2} },
			{klass : Humvee, count : 5, values : {hp:200, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : Tank, count : 10, values : {hp:140, speed:4, power:1, rate:0.1, price: 1, range: 2} },
			{klass : TankI, count : 5, values : {hp:160, speed:4, power:1, rate:0.1, price: 1, range: 2} },
			{klass : TankII, count : 5, values : {hp:180, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 20, values : {hp:140, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 10, values : {hp:120, speed:4, power:1, rate:0.1, price: 1, range: 2} },
			{klass : Humvee, count : 10, values : {hp:140, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 20, values : {hp:120, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 10, values : {hp:105, speed:4, power:1, rate:0.1, price: 1, range: 2} },
			{klass : TankII, count : 10, values : {hp:120, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 20, values : {hp:105, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : Tank, count : 10, values : {hp:90, speed:4, power:1, rate:0.1, price: 1, range: 2} },
			{klass : TankI, count : 10, values : {hp:105, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : Tank, count : 20, values : {hp:90, speed:4, power:1, rate:0.1, price: 1, range: 2} }
		] }
	]
}

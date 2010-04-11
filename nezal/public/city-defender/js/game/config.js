var Config = {
	delay : 10000, //delay between waves, in milliseconds
	towers : [
		{ klass : Turret, name : 'Basic', values : {hp:200, power:15, rate:0.3, price: 5, range: 2} },
		{ klass : Turret, name : 'Moderate', values : {hp:400, power:30, rate:0.4, price: 10, range: 2} },
		{ klass : DoubleTurret, name : 'Heavy', values : {hp:600, power:60, rate:0.5, price: 20, range: 3} },
		{ klass : RocketLauncher, name : 'Ultra', values : {hp:800, power:100, rate:0.05, price: 30, range: 6} }
	],
	waves : [
		{ creeps : [
			{klass : Plane, count : 3, values : {hp:6000, speed:1, power:10, rate:0.5, price: 7, range: 4} }
		] },
		{ creeps : [
			{klass : Plane, count : 13, values : {hp:2800, speed:2, power:2, rate:0.2, price: 6, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 13, values : {hp:2380, speed:2, power:2, rate:0.2, price: 6, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 13, values : {hp:2000, speed:2, power:2, rate:0.2, price: 6, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 13, values : {hp:1740, speed:2, power:2, rate:0.2, price: 6, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 13, values : {hp:1480, speed:2, power:2, rate:0.2, price: 5, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 13, values : {hp:1260, speed:2, power:2, rate:0.2, price: 5, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 13, values : {hp:1080, speed:2, power:2, rate:0.2, price: 5, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 13, values : {hp:925, speed:2, power:2, rate:0.2, price: 5, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 13, values : {hp:790, speed:2, power:2, rate:0.2, price: 4, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 13, values : {hp:675, speed:2, power:2, rate:0.2, price: 4, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 13, values : {hp:580, speed:2, power:2, rate:0.2, price: 4, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 13, values : {hp:500, speed:2, power:2, rate:0.2, price: 4, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 13, values : {hp:420, speed:2, power:1, rate:0.1, price: 3, range: 1} }
		] },
		{ creeps : [
			{klass : TankII, count : 13, values : {hp:360, speed:2, power:1, rate:0.1, price: 3, range: 1} }
		] },
		{ creeps : [
			{klass : TankII, count : 13, values : {hp:310, speed:2, power:1, rate:0.1, price: 3, range: 1} }
		] },
		{ creeps : [
			{klass : TankII, count : 13, values : {hp:265, speed:2, power:1, rate:0.1, price: 3, range: 1} }
		] },
		{ creeps : [
			{klass : TankII, count : 13, values : {hp:225, speed:2, power:1, rate:0.1, price: 2, range: 1} }
		] },
		{ creeps : [
			{klass : TankII, count : 13, values : {hp:200, speed:2, power:1, rate:0.1, price: 2, range: 1} }
		] },
		{ creeps : [
			{klass : TankI, count : 13, values : {hp:170, speed:2, power:1, rate:0.1, price: 2, range: 1} }
		] },
		{ creeps : [
			{klass : TankI, count : 13, values : {hp:140, speed:2, power:1, rate:0.1, price: 2, range: 1} }
		] },
		{ creeps : [
			{klass : TankI, count : 13, values : {hp:120, speed:2, power:1, rate:0.1, price: 1, range: 1} }
		] },
		{ creeps : [
			{klass : TankI, count : 13, values : {hp:105, speed:2, power:1, rate:0.1, price: 1, range: 1} }
		] },
		{ creeps : [
			{klass : TankI, count : 13, values : {hp:90, speed:2, power:1, rate:0.1, price: 1, range: 1} }
		] },

		{ creeps : [
			{klass : TankI, count : 13, values : {hp:75, speed:2, power:1, rate:0.1, price: 1, range: 1} }
		] }
	]
}

var Config = {
	delay : 2000, //delay between waves, in milliseconds
	towers : [
		{ klass : Turret, name : 'Basic', values : {hp:200, power:15, rate:0.1, price: 2, range: 2} },
		{ klass : DoubleTurret, name : 'Double', values : {hp:400, power:30, rate:0.4, price: 5, range: 2} },
		{ klass : Patriot, name : 'Patriot Air Defense', values : {hp:600, power:300, rate:0.1, price: 10, range: 3} },
		{ klass : RocketLauncher, name : 'Rocket Launcher', values : {hp:800, power:100, rate:0.03, price: 1, range: 6} }
	],
	waves : [
		{ creeps : [
			{klass : Plane, count : 3, values : {hp:6000, speed:4, power:50, rate:0.5, price: 7, range: 4} }
		] },
		{ creeps : [
			{klass : Plane, count : 9, values : {hp:2800, speed:4, power:45, rate:0.2, price: 6, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 9, values : {hp:2380, speed:4, power:40, rate:0.2, price: 6, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 9, values : {hp:2000, speed:4, power:35, rate:0.2, price: 6, range: 2} }
		] },/*
		{ creeps : [
			{klass : Plane, count : 9, values : {hp:1740, speed:4, power:30, rate:0.2, price: 6, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 9, values : {hp:1480, speed:4, power:25, rate:0.2, price: 5, range: 2} }
		] },
		{ creeps : [
			{klass : Plane, count : 9, values : {hp:1260, speed:4, power:20, rate:0.2, price: 5, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 9, values : {hp:1080, speed:4, power:2, rate:0.2, price: 5, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 9, values : {hp:925, speed:4, power:2, rate:0.2, price: 5, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 9, values : {hp:790, speed:4, power:2, rate:0.2, price: 4, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 9, values : {hp:675, speed:4, power:2, rate:0.2, price: 4, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 9, values : {hp:580, speed:4, power:2, rate:0.2, price: 4, range: 2} }
		] },
		{ creeps : [
			{klass : Humvee, count : 9, values : {hp:500, speed:4, power:2, rate:0.2, price: 4, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 9, values : {hp:420, speed:4, power:1, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 9, values : {hp:360, speed:4, power:1, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 9, values : {hp:310, speed:4, power:1, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 9, values : {hp:265, speed:4, power:1, rate:0.1, price: 3, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 9, values : {hp:225, speed:4, power:10, rate:0.1, price: 2, range: 2} }
		] },
		{ creeps : [
			{klass : TankII, count : 9, values : {hp:200, speed:4, power:10, rate:0.1, price: 2, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 9, values : {hp:170, speed:4, power:10, rate:0.1, price: 2, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 9, values : {hp:140, speed:4, power:10, rate:0.1, price: 2, range: 2} }
		] },*/
		{ creeps : [
			{klass : TankI, count : 9, values : {hp:120, speed:4, power:30, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 9, values : {hp:105, speed:4, power:20, rate:0.1, price: 1, range: 2} }
		] },
		{ creeps : [
			{klass : TankI, count : 9, values : {hp:90, speed:4, power:10, rate:0.1, price: 1, range: 2} }
		] }
	]
}

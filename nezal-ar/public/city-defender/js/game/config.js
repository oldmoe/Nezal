var Config = {
	delay : 2000, //delay between waves, in milliseconds
	towers : [
		//{ category : Turret, name : 'Basic', values : {} },
		{ category : Turret, name : 'Basic', values : {hp:300, power:5, rate:0.4, price: 10, range: 2} },
		{ category : DoubleTurret, name : 'Double', values : {hp:600, power:10, rate:0.2, price: 30, range: 2} },
		{ category : Patriot, name : 'Patriot Air Defense', values : {hp:1000, power:20, rate:0.3, price: 60, range: 3} },
		{ category : RocketLauncher, name : 'Rocket Launcher', values : {hp:800, power:100, rate:0.05, price: 50, range: 2} }
	],
	waves : [

		{ creeps : [
			{category : BlackTank, count : 1}			
		] }
	]
}

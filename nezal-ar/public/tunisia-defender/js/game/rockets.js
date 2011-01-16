var RocketLauncher = Class.create(Turret, {
	name : 'Exploder',
	targets : 'Ground<br/>Only',
	facilities : 'Fires Rockets',
	cssClass : 'rocketLauncher',
	reloaded: true,
	type: 'RocketLauncher',
	canHitFlying: false,
	canHitGround: true,
	hp:1700, power:150, rate:0.05, price: 40, range: 3,maxHp : 1200,
	upgrades : [{maxHp: 2100, power:200, price: 13},
							{maxHp: 2500, power:300, price: 17},
							{maxHp: 3000, power:410, range:4, price: 45}],
	initialize : function($super,x,y,scene,extension){
		$super(x,y,scene,extension)
	},
	
	tick: function($super){
		$super()
	},
	changeFireState: function(){
		if(this.fired){
			this.fired = false
			var power = this.power
      this.scene.addRocket(new Rocket(this.x, this.y,this.scene,{parent : this, theta: this.cannonTheta, targetUnit : this.targetUnit, x : this.x, y : this.y, power: this.power}))
		}
	},
	fire : function(){
		//Sounds.play(Sounds.turret.rocketLaunch)
	},
	destroySprites : function($super){
		$super()
		this.rocketSprite.destroy()
	}
})

var Patriot = Class.create(Turret, {
	name : 'Patriot',
	targets : 'Air<br/>Only',
	facilities : 'Fires Rockets',
	type: 'Patriot',
	firing_turn : 0,
	canHitFlying: true,
	canHitGround: false,
	cssClass : 'patriot',
	hp:1200, power:40, rate:0.3, price: 60, range: 4,maxHp: 1200,
	upgrades : [{maxHp: 1450, power:50, price: 12},
							{maxHp: 1730, power:60, price: 30,range:5},
							{maxHp: 2075, power:70, rate: 0.4, price: 55}],
	initialize : function($super,x,y,scene,extension){
		$super(x,y,scene,extension)
	},
	changeFireState: function(){
		if(this.fired){
			this.firing_turn = 1 - this.firing_turn
			var rocketX = this.x
			var rocketY = this.y + (this.firing_turn == 0 ? (5) : (-5))
			var power = this.power
      this.scene.addPatriotRocket(new PatriotRocket(this.x, this.y,this.scene, {parent : this, theta: this.cannonTheta, targetUnit : this.targetUnit, x : rocketX, y : rocketY, power:this.power}))
		}
	},
	fire : function(target){
		
	}
})

var Rocket = Class.create(Unit, {
	speed : 12,
	step : 0,
	power: 20,
	lastTargetX : 0,
	lastTargerY : 0,
	initialize : function($super,x,y,scene,extension){
		$super(x,y,scene,extension)
		this.dead = false
	},	
	tick : function(){
		if(this.targetUnit){
			this.lastTargetX  =  this.targetUnit.x
			this.lastTargetY  =  this.targetUnit.y
		}
		var dx = this.x - this.lastTargetX;
		var dy = this.y - this.lastTargetY;
		var distance = Math.sqrt(dx * dx + dy * dy);
		var theta = Math.acos( dx / distance ) *  180 / Math.PI; 		
		if( dy >= 0 ){
			this.theta = theta; 
		}else{
			this.theta = -theta; 
		}
		this.step++;
		if(distance - (this.speed * this.step) <= this.speed){
			if(!this.targetUnit.dead){
				this.targetUnit.takeHit(this.power);
				if(this.targetUnit.dead){
					if(this.parent && !this.parent.dead){
						//var moneyAnim = new MoneyAnimation(this.targetUnit.x-10,this.targetUnit.y-5,Math.round(this.targetUnit.price))
						//this.scene.objects.push(moneyAnim)
						this.scene.scenario.notify({name:"towerDestroyedCreep", method: false, unit:this.parent})
					}
				}
			}
			this.die();		
		}
	},
	die : function(){
		this.dead = true
	}
})
var PatriotRocket = Class.create(Rocket, {	
	speed : 10	
})


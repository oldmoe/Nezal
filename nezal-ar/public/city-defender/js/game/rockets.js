var RocketLauncher = Class.create(Turret, {
	name : 'Exploder',
	targets : 'Ground<br/>Only',
	facilities : 'Fires Rockets',
	cssClass : 'rocketLauncher',
	reloaded: true,
	canHitFlying: false,
	canHitGround: true,
	hp:1700, power:150, rate:0.05, price: 40, range: 3,maxHp : 1200,
	upgrades : [{maxHp: 2100, power:200, price: 13},
							{maxHp: 2500, power:300, price: 17},
							{maxHp: 3000, power:410, range:4, price: 45}],
	initialize : function($super,x,y,scene,extension){
		this.initImages(1)
		$super(x,y,scene,extension)
	},
	createSprites : function(){
		this.rangeSprite = new RangeSprite(this.range)
		this.rocketSprite = new Sprite(this.images.rocket)
		this.baseSprite = new Sprite(this.images.base)
		this.cannonSprite = new Sprite(this.images.pad)
		this.rankSprite = new Sprite(this.images.ranks)
		this.healthSprite = new HealthSprite(this.hp,this.maxHp)
		this.baseSprite.moveTo(this.x,this.y)
		this.cannonSprite.moveTo(this.x,this.y)
		this.rankSprite.moveTo(this.x+50, this.y-5)
		this.healthSprite.moveTo(this.x,this.y)
		this.rocketSprite.moveTo(this.x,this.y)
		this.rangeSprite.moveTo(this.x,this.y)
	},
	initImages : function(rank){
		this.images ={}
		this.images.base = [Loader.images.game['tower_base_'+rank+'.png']],
		this.images.pad = [Loader.images.game['exploder.png']],
		this.images.rocket = [Loader.images.game['exploder_rocket.png']],
		this.images.ranks = [null,Loader.images.game['rank_1.png'], Loader.images.game['rank_2.png'], Loader.images.game['rank_3.png']]
	},
	
	tick: function($super){
		$super()
		this.rocketSprite.rotation = this.cannonSprite.rotation
	},
	changeFireState: function(){
		if(this.reloaded){
			this.rocketSprite.draw = true		
		}
		else this.rocketSprite.draw = false		
		if(this.fired){
			this.fired = false
			var power = this.power
			this.scene.rockets.push( new Rocket(this.x, this.y,this.scene,{parent : this, theta: this.cannonTheta, targetUnit : this.targetUnit, x : this.x, y : this.y, power: this.power}))
		}
		
	},
	fire : function(){
		Sounds.play(Sounds.turret.rocketLaunch)
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
	cssClass : 'patriot',
	firing_turn : 0,
	canHitFlying: true,
	canHitGround: false,
	hp:1200, power:40, rate:0.3, price: 60, range: 4,maxHp: 1200,
	upgrades : [{maxHp: 1450, power:50, price: 12},
							{maxHp: 1730, power:60, price: 30,range:5},
							{maxHp: 2075, power:70, rate: 0.4, price: 55}],
	initialize : function($super,x,y,scene,extension){
		this.initImages(1)
		$super(x,y,scene,extension)
	},
	initImages: function(rank){
		this.images = {}
		this.images.base = [Loader.images.game['tower_base_'+rank+'.png']],
		this.images.cannon = [Loader.images.game['patriot.png']],
		this.images.fire = [Loader.images.game['patriot_inaction_right.png'], Loader.images.game['patriot_inaction_left.png']],
		this.images.ranks = [null,Loader.images.game['rank_1.png'], Loader.images.game['rank_2.png'], Loader.images.game['rank_3.png']]
	},
	changeFireState: function(){
		if(this.fired){
			this.fired = false		
			this.firing_turn = 1 - this.firing_turn
			this.cannonSprite.currentFrame = this.firing_turn+1
			var rocketX = this.x
			var rocketY = this.y + (this.firing_turn == 0 ? (5) : (-5))
			var power = this.power
			this.scene.rockets.push(new PatriotRocket(this.x, this.y,this.scene, {parent : this, theta: this.cannonTheta, targetUnit : this.targetUnit, x : rocketX, y : rocketY, power:this.power}))
		}else{
			this.cannonSprite.currentFrame = 0		
		}
	
	},
	fire : function(target){
		Sounds.play(Sounds.turret.patriotLaunch)
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
		this.rocketSprite = new Sprite([Loader.images.game['exploder_rocket_inaction.png']])
		this.rocketSprite.moveTo(this.x,this.y)
		this.scene.towerHealthLayer.attach(this.rocketSprite)
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
						var moneyAnim = new MoneyAnimation(this.targetUnit.x-10,this.targetUnit.y-5,Math.round(this.targetUnit.price))
						this.scene.objects.push(moneyAnim)
						this.scene.scenario.notify({name:"towerDestroyedCreep", method: false, unit:this.parent})
					}
				}
			}
			this.die();		
		}
		this.modifySprites()	
	},
	modifySprites : function(){
		this.rocketSprite.rotation = Nezal.degToRad(this.theta)
		this.rocketSprite.transitionX = -(this.step*this.speed)
	},
	die : function(){
		this.rocketSprite.destroy()
		this.dead = true
	}
})
var PatriotRocket = Class.create(Rocket, {
	initialize : function($super,x,y,scene,extension){
		$super(x,y,scene,extension)
		this.rocketSprite.images = [Loader.images.game['patriot_rocket.png']]
		this.scene.basesLayer.attach(this.rocketSprite)	
		this.rocketSprite.rotation = Nezal.degToRad(this.theta)
		this.rocketSprite.moveTo(this.x, this.y)
	},	
	modifySprites : function(){
		this.rocketSprite.rotation = Nezal.degToRad(this.theta)
		this.rocketSprite.transitionX = -(this.step*this.speed)
	},
	speed : 10
	
})


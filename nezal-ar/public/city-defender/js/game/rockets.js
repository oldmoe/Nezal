var RocketLauncher = Class.create(Turret, {
	name : 'R1G',
	targets : 'Ground<br/>Only',
	facilities : 'Fires Rockets',
	cssClass : 'rocketLauncher',
	reloaded: true,
	canHitFlying: false,
	canHitGround: true,
	hp:1200, power:100, rate:0.05, price: 45, range: 3,
	initialize : function($super,x,y,scene,extension){
		this.initImages()
		$super(x,y,scene,extension)
	},
	createSprites : function(){
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
	},
	initImages : function(){
		this.images ={}
		this.images.base = [Loader.images.game['tower_base.png']],
		this.images.pad = [Loader.images.game['rocket_launcher.png']],
		this.images.rocket = [Loader.images.game['rocket.png']],
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
			if(this.rank > 0){
				power *= this.ranks[this.rank - 1]
			}
			this.scene.rockets.push( new Rocket(this.x, this.y,this.scene,{parent : this, theta: this.cannonTheta, targetUnit : this.targetUnit, x : this.x, y : this.y, power: this.power}))
		}
		
	},
	fire : function(){
		Sounds.play(Sounds.turret.rocketLaunch)
	}
})

var Patriot = Class.create(Turret, {
	name : 'R4A',
	targets : 'Air<br/>Only',
	facilities : 'Fires Rockets',
	cssClass : 'patriot',
	firing_turn : 0,
	canHitFlying: true,
	canHitGround: false,
	hp:1200, power:40, rate:0.3, price: 60, range: 3,
	initialize : function($super,x,y,scene,extension){
		this.initImages()
		$super(x,y,scene,extension)
	},
	initImages: function(){
		this.images = {}
		this.images.base = [Loader.images.game['tower_base.png']],
		this.images.cannon = [Loader.images.game['patriot_launcher.png']],
		this.images.fire = [Loader.images.game['patriot_launcher_in_action_right.png'], Loader.images.game['patriot_launcher_in_action_left.png']],
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
			if(this.rank > 0){
				power *= this.ranks[this.rank - 1]
			}			
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
		this.rocketSprite = new Sprite([Loader.images.game['rocket_in_action.png']])
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
						this.parent.kills++
						if(this.parent.kills == this.parent.rankKills[this.parent.rank] && this.parent.rank < this.parent.maxRank){
							this.parent.rank += 1;
							this.parent.kills = 0;
						}			
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
	speed : 10,
	
})


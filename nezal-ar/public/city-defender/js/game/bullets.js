var Turret = Class.create(Unit, {
	theta :0,
	cannonTheta : 0,
	rank : 0,
	maxRank : 3,
	kills : 0,
	ranks : [1.1, 1.3, 1.7],
	rankKills : [4, 8, 16],
	fireSound : Sounds.turret.fire,
	canHitFlying: true,
	canHitGround: true,
	name : 'C1B',
	targets : 'Air &<br/>Ground',
	facilities : 'Fires Bullets',
	cssClass : 'tower',
	hp:300,maxHp : 300, power:5, rate:0.2, price: 10, range: 2,
	initialize: function($super,x,y,scene,extension){
		$super(x,y,scene,extension)
		this.initImages()
		this.createSprites()
		
	},
	createSprites : function(){
		this.baseSprite = new Sprite(this.images.base)
		this.cannonSprite = new Sprite(this.images.cannon.concat(this.images.fire))
		this.rankSprite = new Sprite(this.images.ranks)
		this.healthSprite = new HealthSprite(this.hp,this.maxHp)
		this.baseSprite.moveTo(this.x,this.y)
		this.cannonSprite.moveTo(this.x,this.y)
		this.rankSprite.moveTo(this.x+50, this.y-5)
		this.healthSprite.moveTo(this.x,this.y)
	},
	initImages : function(){
		this.images = {}
		this.images.base = [Loader.images.game['tower_base.png']]
		this.images.cannon = [Loader.images.game['cannon_1.png']]
		this.images.fire = [Loader.images.game['cannon_1_in_action.png']]
		this.images.ranks = [null,Loader.images.game['rank_1.png'], Loader.images.game['rank_2.png'], Loader.images.game['rank_3.png']]
	},
	
	getTargetfromCell: function(cell, targets){
		cell.each(function(obj){targets.push(obj)})
	},
	
	tick: function(){
		this.target()
		this.modifySprites()
	},
	modifySprites : function(){
		this.cannonSprite.rotation = Nezal.degToRad(this.cannonTheta)
		this.changeFireState()
		this.healthSprite.hp = this.hp
		this.healthSprite.maxHp = this.maxHp
		this.rankSprite.currentFrame = this.rank
		if(this.baloon)this.baloon.moveTo(this.x,this.y-70)
	},
	changeFireState: function(){
		if(this.fired){
			this.fired = false
			this.cannonSprite.currentFrame = 1
		}
		else{
			this.cannonSprite.currentFrame = 0
		}
	},
	pickTarget: function(targets){
		targets.sort(function(a,b){return a.hp - b.hp})
		if(!this.canHitFlying){
			targets = targets.select(function(t){ return !t.flying})
		}
		if(!this.canHitGround){
			targets = targets.select(function(t){ return t.flying})
		}
		if(targets.length == 0) return
		var target = targets[0]
		var dx = this.x - target.x
		var dy = this.y - target.y
		var distance = Math.sqrt(dx*dx + dy*dy)
		var theta = Math.acos(dx/distance) *  180 / Math.PI  
		if( dy >=0 ){
			this.cannonTheta = theta - this.theta
		}else{
			this.cannonTheta = this.theta - theta
		}
		if( dy == 0 && dx == 0){
			this.cannonTheta = this.theta
		}
		if(this.reloaded){
			this.fire(target)
			this.reloaded = false;
			this.fired = true;
		}
		this.targetUnit = target
	},
	
	fire : function(target){
		Sounds.play(this.fireSound)
		var power = this.power
		if(this.rank > 0){
			power *= this.ranks[this.rank - 1]
		}
		target.takeHit(power)
		if(target.dead){
			this.kills += 1
			if(this.kills == this.rankKills[this.rank] && this.rank < this.maxRank){
				this.rank += 1;
				this.kills = 0;
			}			
		}
	},
	die: function(){
		this.destroySprites()
		Map.grid[this.gridX][this.gridY] = [];
		this.scene.stats.towersDestroyed++;
	},
	destroySprites : function(){
		this.dead = true
		this.baseSprite.destroy()
		this.cannonSprite.destroy()
		this.healthSprite.destroy()
		this.rankSprite.destroy()
	}
})

var DoubleTurret = Class.create(Turret, {
	name : 'C2B',
	cssClass : 'doubleTower',
	fireSound : Sounds.doubleTurret.fire,
	firing_turn : 0,
	hp:600, power:10, rate:0.4, price: 30, range: 2,
	initialize: function($super,x,y,scene,extension){
		$super(x,y,scene,extension)
	},
	initImages : function($super){
		$super()
		this.images.cannon = [Loader.images.game['cannon_2.png']]
		this.images.fire = [Loader.images.game['cannon_2_in_action_right.png'],Loader.images.game['cannon_2_in_action_left.png']]	

	},
	changeFireState : function(){
		if(this.fired){
			this.fired = false
			this.firing_turn = 1-this.firing_turn
			this.cannonSprite.currentFrame = this.firing_turn+1
		}
		else{
			this.cannonSprite.currentFrame = 0
		}
	}
})

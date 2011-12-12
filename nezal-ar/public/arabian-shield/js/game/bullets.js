var Turret = Class.create(Unit, {
	theta :0,
	cannonTheta : 0,
	rank : 0,
	stateChange : false,
	upgradable :true,
	maxRank :3,
	canHitFlying: true,
	canHitGround: true,
	name : 'Belcher',
	targets : 'Air &<br/>Ground',
	facilities : 'Fires Bullets',
	type : 'Turret',
	cssClass : 'tower',
	hp:500, maxHp : 500, power:10, rate:0.2, price: 30, range: 2,
	upgradeValues : ['maxHp', 'power', 'rate', 'range'],
	upgrades : [{maxHp: 1100, power:18, price: 3},
							{maxHp: 1300, power:22, price: 8,range: 3},
							{maxHp: 1600, power:26, rate: 0.3, price: 21,range: 4}],
	initialize: function($super,x,y,scene,extension){
		this.display=null
		this.hp=this.maxHp
		$super(x,y,scene,extension)
	},
	
	upgrade : function(){
		if(this.rank == this.maxRank) return false		
		var upgrade = this.upgrades[this.rank] // this is the next rank (base 1 array)
		if(this.scene.money < upgrade.price) return false
		this.rank += 1
		var self = this
		var oldHp = this.maxHp
		this.upgradeValues.each(function(v){if(upgrade[v])self[v] = upgrade[v]})
		this.price += upgrade.price
		this.hp *= this.maxHp / oldHp 
		this.scene.money -= upgrade.price
		return true
	},
	getTargetfromCell: function(cell, targets){
		cell.each(function(obj){targets.push(obj)})
	},
	tick: function(){
		this.target()
		this.modifySprites()
	},
	modifySprites : function(){
		this.changeFireState()
	},
	pickTarget: function(targets){
		this.fired = false
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
		var power = this.power
		target.takeHit(power)
		if(target.dead){
		  this.scene.scenario.notify({name:"towerDestroyedCreep", method: false, unit:this})
		}
	},
	die: function(){
		this.destroy()
		Map.grid[this.gridX][this.gridY] = [];
		this.scene.stats.towersDestroyed++;
	},
	changeFireState : function(){
	
	},
	destroy : function(){
		this.dead = true
	}
})

var DoubleTurret = Class.create(Turret, {
	name : 'Reaper',
	type : 'DoubleTurret',
	cssClass : 'doubleTower',
	firing_turn : 0,
	hp:900, power:15, rate:0.4, price: 30, range: 2,
	upgrades : [{maxHp: 1550, power:18, price: 5},
							{maxHp: 1875, power:22, price: 10,rate :0.5},
							{maxHp: 1600, power:26, rate: 0.6, price: 30,range: 3}],
	initialize: function($super,x,y,scene,extension){
		$super(x,y,scene,extension)
	},
	changeFireState : function(){
		if(this.fired){
			this.firing_turn = 1-this.firing_turn
		}
	}
})

var Turret = Class.create(Unit, {
	theta :0,
	cannonTheta : 0,
	rank : 0,
	stateChange : false,
	upgradable :true,
	maxRank :3,
	fireSound : Sounds.turret.fire,
	canHitFlying: true,
	canHitGround: true,
	name : 'Belcher',
	targets : 'Air &<br/>Ground',
	facilities : 'Fires Bullets',
	cssClass : 'tower',
	hp:500, maxHp : 500, power:10, rate:0.2, price: 30, range: 2,
	upgradeValues : ['maxHp', 'power', 'rate', 'range'],
	upgrades : [{maxHp: 1100, power:18, price: 3},
							{maxHp: 1300, power:22, price: 8,range: 3},
							{maxHp: 1600, power:26, rate: 0.3, price: 21,range: 4}],
	initialize: function($super,x,y,scene,extension){
		this.hp=this.maxHp
		$super(x,y,scene,extension)
		this.initImages(1)
		this.createSprites()
	},
	
	upgrade : function(){
		if(this.rank == this.maxRank) return		
		if(this.upgradable)Sounds.play(Sounds.gameSounds.click)
		var upgrade = this.upgrades[this.rank] // this is the next rank (base 1 array)
		if(this.scene.money < upgrade.price) return false
		this.rank += 1
		var self = this
		var oldHp = this.maxHp
		this.upgradeValues.each(function(v){if(upgrade[v])self[v] = upgrade[v]})
		this.price += upgrade.price
		this.hp *= this.maxHp / oldHp 
		this.scene.money -= upgrade.price
		if(this.rank==4)this.initImages(2)
		else if(this.rank==8)this.initImages(3)
		return this
	},

	createSprites : function(){
		this.rangeSprite = new RangeSprite(this.range)
		this.baseSprite = new Sprite(this.images.base)
		if(this.images.cannon)this.cannonSprite = new Sprite(this.images.cannon.concat(this.images.fire))
		this.rankSprite = new Sprite(this.images.ranks)
		this.healthSprite = new HealthSprite(this.hp,this.maxHp)
		this.baseSprite.moveTo(this.x,this.y)
		this.baseSprite.moveTo(this.x,this.y)
		this.cannonSprite.moveTo(this.x,this.y)
		this.rankSprite.moveTo(this.x+50, this.y-5)
		this.healthSprite.moveTo(this.x,this.y)
		this.rangeSprite.moveTo(this.x,this.y)
		
	},
	initImages : function(rank){
		this.images = {}
		this.images.base = [Loader.images.game['tower_base_'+rank+'.png']]
		this.images.cannon = [Loader.images.game['belcher_'+rank+'.png']]
		this.images.fire = [Loader.images.game['belcher_'+rank+'_inaction.png']]
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
		this.baseSprite.images = this.images.base
		if(this.images.cannon)this.cannonSprite.images = this.images.cannon.concat(this.images.fire)
		this.healthSprite.maxHp = this.maxHp
		this.rankSprite.currentFrame = this.rank %4;
		if(this.baloon)this.baloon.moveTo(this.x,this.y-70);
		this.rangeSprite.range = this.range
		this.baseSprite.moveTo(this.x,this.y)
		this.baseSprite.moveTo(this.x,this.y)
		this.cannonSprite.moveTo(this.x,this.y)
		this.rankSprite.moveTo(this.x+50, this.y-5)
		this.healthSprite.moveTo(this.x,this.y)
		this.rangeSprite.moveTo(this.x,this.y)

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
		target.takeHit(power)
		if(target.dead){
			this.scene.scenario.notify({name:"towerDestroyedCreep", method: false, unit:this})
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
		if(this.scene.selectedTower&&this.scene.selectedTower.gridX == this.gridX && this.scene.selectedTower.gridY == this.gridY){
			this.scene.selectedTower = null
			$('towerInfo').innerHTML = ""
		}
		if(this.baloon)this.baloon.destroy()
		this.rangeSprite.destroy()
	}
})

var DoubleTurret = Class.create(Turret, {
	name : 'Reaper',
	cssClass : 'doubleTower',
	fireSound : Sounds.turret.fire,
	firing_turn : 0,
	hp:900, power:15, rate:0.4, price: 30, range: 2,
	upgrades : [{maxHp: 1550, power:18, price: 5},
							{maxHp: 1875, power:22, price: 10,rate :0.5},
							{maxHp: 1600, power:26, rate: 0.6, price: 30,range: 3}],
	initialize: function($super,x,y,scene,extension){
		$super(x,y,scene,extension)
	},
	initImages : function($super,rank){
		$super(rank)
		this.images.cannon = [Loader.images.game['reaper_'+rank+'.png']]
		this.images.fire = [Loader.images.game['reaper_'+rank+'_inaction_right.png'],Loader.images.game['reaper_'+rank+'_inaction_left.png']]	

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

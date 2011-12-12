var Unit = Class.create({
//	_oldRenders : [],
	initialize: function(x, y,scene, extension){
		this.gridX = x
		this.gridY = y
		this.x = Map.pitch * (x + 0.5)
		this.y = Map.pitch * (y + 0.5)
		if(extension){
			Object.extend(this, extension)
		}
		this.scene = scene
		this.maxHp = this.hp
		return this
	},
	target: function(){
		if(this.dead) return
		if(this.fired) this.fired = false
		if(!this.reloaded){
			this.toFire += this.rate;
			if(this.toFire >= 1){
				this.reloaded = true;
				this.toFire -= 1
			}
		}
		// look at the surrounding grid locations
		var targets = []
		for(var i = this.gridX - this.range; i < this.gridX + this.range + 1; i++){
			for(var j = this.gridY - this.range; j < this.gridY + this.range + 1; j++){
				if(Map.grid[i] && Map.grid[i][j]){
					this.getTargetfromCell(Map.grid[i][j], targets)
				}
			}
		}
		if(targets.length >= 1){
			this.pickTarget(targets)
		}else{
			this.targetUnit = null
		}
		return this;
	},
	getTargetfromCell: function(cell, targets){
	},
	pickTarget: function(targets){
	},
	takeHit: function(power){
		if(this.dead) return
		this.hp -= power
		if(this.hp <= 0 ){
      this.killed = true
			this.dead = true; 
			this.die(); 
		}
		return this;
	},
	die: function(){
		alert('die not implemented')
	},
	//images: {},
	hp: 100, maxHp: 100, 
	rate: 0.2, toFire: 0,
	reloded: true,	fired: false,
	power: 2.5, range: 2,
	x: 0, y: 0, gridX: 0, gridY: 0
})

var Turret = Class.create(Unit, {
	images : {
		base : Game.images['tower_base.png'],
		cannon : Game.images['cannon_1.png'],
		fire : Game.images['cannon_1_in_action.png'],
		ranks : [Game.images['rank_1.png'], Game.images['rank_2.png'], Game.images['rank_3.png']]
	},
	hp : 100,
	maxHp : 100,
	theta :0,
	cannonTheta : 0,
	rate : 0.1,
	power: 3.0,
	range: 3,
	price: 15,
	rank : 0,
	maxRank : 3,
	kills : 0,
	ranks : [1.1, 1.3, 1.7],
	rankKills : [4, 8, 16],
	fireSound : Sounds.turret.fire,
	canHitFlying: true,
	canHitGround: true,
	getTargetfromCell: function(cell, targets){
		cell.each(function(obj){targets.push(obj)})
	},
	
	name : 'C1B',
	targets : 'Air &<br/>Ground',
	facilities : 'Fires Bullets',
	cssClass : 'tower',
	
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
			//console.log(this.kills)
			if(this.kills == this.rankKills[this.rank] && this.rank < this.maxRank){
				this.rank += 1;
				//console.log(this.rank)
				this.kills = 0;
			}			
		}
	},
	
	
	
	render : function(){
		this.target()
		this.ctx.save()
		this.ctx.translate(this.x, this.y)
		this.ctx.rotate(Math.PI/180 * this.theta)
		if(this == Game.selectedTurret){
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(-18,-18, 36,36)
		}
		this.ctx.drawImage(this.images.base, -48, -16)		
		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(-16, -22, 32, 3)
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(-16, -22, 32 * this.hp / this.maxHp, 3 )
		this.ctx.rotate(Math.PI/180 * this.cannonTheta)
		this.ctx.drawImage(this.images.cannon, -48, -16)		
		if(this.fired){
			this.fired = false
			this.ctx.drawImage(this.images.fire, -48, -16)		
		}else{
			this.ctx.drawImage(this.images.cannon, -48, -16)		
		}
		this.ctx.restore();
		this.renderRank();
	},

	renderRank : function(){
		if(this.rank > 0){
			this.ctx.drawImage(this.images.ranks[this.rank-1], this.x+5, this.y-15)
		}
	},
	
	clear : function(){
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
	},
	
	die: function(){
		Game.turrets.splice(Game.turrets.indexOf(this),1)
		Map.grid[this.gridX][this.gridY] = [];
		if(Game.selectedTurret == this){
			Game.selectedTurret = null;
		}
		Game.stats.towersDestroyed++;
	}
})

var DoubleTurret = Class.create(Turret, {
	name : 'C2B',
	cssClass : 'doubleTower',
	fireSound : Sounds.doubleTurret.fire,
	images : {
		base : Game.images['tower_base.png'],
		cannon : Game.images['cannon_2.png'],
		fire : [Game.images['cannon_2_in_action_right.png'], Game.images['cannon_2_in_action_left.png']],
		ranks : [Game.images['rank_1.png'], Game.images['rank_2.png'], Game.images['rank_3.png']]
	},
	firing_turn : 0,
	render : function(){
		this.target()
		this.ctx.save()
		this.ctx.translate(this.x, this.y)
		this.ctx.rotate(Math.PI/180 * this.theta)
		if(this == Game.selectedTurret){
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(-18,-18, 36,36)
		}
		this.ctx.drawImage(this.images.base, -48, -16)		
		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(-16, -22, 32, 3)
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(-16, -22, 32 * this.hp / this.maxHp, 3 )
		this.ctx.rotate(Math.PI/180 * this.cannonTheta)
		if(this.fired){
			this.fired = false
			this.ctx.drawImage(this.images.fire[this.firing_turn], -48, -16)	
			this.firing_turn += 1
			if(this.firing_turn > 1) this.firing_turn = 0
		}else{
			this.ctx.drawImage(this.images.cannon, -48, -16)		
		}
		this.ctx.restore();
		this.renderRank();
	},
})
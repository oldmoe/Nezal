var Turret = Class.create(Unit, {
	images : {
		base : cityDefenderImages['tower_base.png'],
		cannon : cityDefenderImages['canon_1.png'],
		fire : cityDefenderImages['canon_1_in_action.png'],
	},
	hp : 100,
	maxHp : 100,
	theta :0,
	cannonTheta : 0,
	rate : 0.1,
	power: 3.0,
	range: 3,
	price: 15,
	getTargetfromCell: function(cell, targets){
		cell.each(function(obj){targets.push(obj)})
	},
	pickTarget: function(targets){
		targets.sort(function(a,b){return a.hp - b.hp})
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
		if(this.reloaded){
			this.fire(target)
			this.reloaded = false;
			this.fired = true;
		}
		this.targetUnit = target
	},
	
	fire : function(target){
		target.takeHit(this.power)
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
	},

	clear : function(){
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
	},
	
	die: function(){
		Game.turrets.splice(Game.turrets.indexOf(this),1)
		Map.grid[this.gridX][this.gridY] = [];
		if(Game.selectedTurret == this){
			Game.selectedTurret = null;
			$('unitData').innerHTML = ''
		}
	}
})

Turret.price = 15;
Turret.timingout = false;

var Creep = Class.create(Unit,{
	speeds : [0, 1.08, 2.245, 4.8520, 6.0230, 7.9450, 11.71, 22.6250],
	angles : [0, 3.75, 7.5, 15, 18, 22.5, 30, 45],
	theta : 0, cannonTheta : 0,
	olderTheta : 0, oldestTheta: 0,
	hp : 100, maxHp : 100,
	speed : 2, price : 4,
	evading : false, direction : 0,
	rate : 0.2, power: 2.0,
	cannonDisplacement : [-4, 0],
	initialize : function($super, canvas, x, y, extension){
		$super(canvas, x, y,  extension)
		this.angle = this.angles[this.speed]
		Map.grid[x][y].push(this);
		this.initTraces()
	},
	images : {
		base : cityDefenderImages['tank_body.png'],
		cannon :  cityDefenderImages['tank_tower.png'],
		fire :  cityDefenderImages['tank_tower_in_action.png'],
	},
	
	initTraces : function(){
		this.images.trace[0] =  cityDefenderImages['tank_trace_100.png']
		this.images.trace[1] =  cityDefenderImages['tank_trace_50.png']
		this.images.trace[2] =  cityDefenderImages['tank_trace_20.png']
	},
	move : function(){
		this.oldestTheta = this.olderTheta
		this.olderTheta = this.theta
		var gridX = Math.floor((this.x) / Map.pitch)
		var gridY = Math.floor((this.y) / Map.pitch)
		// we see a wall ahead, we need to react
		if(this.evading){
			if(Map.grid[this.gridX] && Map.grid[this.gridX][this.gridY + this.direction] && Map.grid[this.gridX][this.gridY + this.direction].length > 1) return 
			if(Map.grid[this.gridX+1] && Map.grid[this.gridX+1][this.gridY + this.direction] && Map.grid[this.gridX+1][this.gridY + this.direction].length > 1) return 
			this.theta += this.direction * this.angle
			if(this.theta < 0)this.theta += 360 
			if(this.theta > 360)this.theta -= 360 
			if((this.theta >= 180 && this.theta <= 270) || (this.theta >= 90 && this.theta <= 180)){
				this.direction  *= -1	
				this.theta += this.direction * this.angle   
			}
			if(this.theta == 0 || this.theta == 360){
				this.evading = false
			}
		}else if(Map.grid[this.gridX+1] && (Map.grid[this.gridX+1][this.gridY].tower || Map.grid[this.gridX+1][this.gridY].length > 0)){
			if((this.x - this.speeds[this.speed]) > Math.floor(this.x/Map.pitch) * Map.pitch){
				this.x = Math.floor(this.x/Map.pitch)* Map.pitch
			}else{
				this.evading = true
				if( this.gridY == (Map.height - 1) ){
					this.direction  = -1
				}else if(this.gridY == 0){
					this.direction  = 1
				}else{
					this.direction = [1,-1][Math.round(Math.random())]
				}
				this.theta += this.direction * this.angle
			}
		}else if(Map.grid[this.gridX+1] && Map.grid[this.gridX+1][this.gridY].length >= 1){
			return
		}		
		this.x += this.speeds[this.speed] * Math.cos(this.theta * Math.PI / 180)
		this.y += this.speeds[this.speed] * Math.sin(this.theta * Math.PI / 180)
		var newGridX = Math.floor((this.x) / Map.pitch)
		var newGridY = Math.floor((this.y) / Map.pitch)
		if(this.gridX >= Map.width){
			// we are out, take us from the game
			if(this.x >= (Map.width * Map.pitch + Map.pitch / 2)){
				Game.escaped += 1
				Game.creeps.splice(Game.creeps.indexOf(this), 1)
			}			
		}else if(this.gridX != newGridX || this.gridY != newGridY){
			var oldArr = Map.grid[this.gridX][this.gridY]
			oldArr.splice(oldArr.indexOf(this), 1);
			this.gridX = newGridX
			this.gridY = newGridY
			if(newGridX < Map.width){
				Map.grid[newGridX][newGridY].push(this);
			}else{
				// we are going out, do nothing for now;
			}
		}
	},
	render : function(){
		this.target();
		this.ctx.save()
		this.ctx.translate(this.x, this.y)
		this.ctx.save()
		this.ctx.rotate(Math.PI/180 * this.oldestTheta)
		this.ctx.drawImage(this.images.trace[2], -48, -16)
		this.ctx.restore()
		this.ctx.save()
		this.ctx.rotate(Math.PI/180 * this.olderTheta)
		this.ctx.drawImage(this.images.trace[1], -48, -16)
		this.ctx.restore()
		this.ctx.rotate(Math.PI/180 * this.theta)
		this.ctx.drawImage(this.images.trace[0], -48, -16)
		this.ctx.drawImage(this.images.base, -48, -16)
		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(-15, -16, 24, 3)
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(-15, -16, 24 * this.hp / this.maxHp, 3)
		this.ctx.translate(this.cannonDisplacement[0], this.cannonDisplacement[1])
		this.ctx.rotate(Math.PI/180 * this.cannonTheta)
		if(this.fired){
			this.ctx.drawImage(this.images.fire, -44, -16)
			this.fired = false
		}else{
			this.ctx.drawImage(this.images.cannon, -44, -16)	
		}
		this.ctx.restore();
	},
	getTargetfromCell: function(cell, targets){
		if(cell.tower){targets.push(cell.tower)}
	},
	
	pickTarget: function(targets){
		targets.sort(function(a,b){return a.hp - b.hp})
		var target = targets[0]
		var dx = this.x - target.x
		var dy = this.y - target.y
		var distance = Math.sqrt(dx * dx + dy * dy)
		var theta = Math.acos(dx/distance) *  180 / Math.PI  		
		if( dy >=0 ){
			this.cannonTheta = 180 + theta + this.theta
		}else{
			this.cannonTheta = 180 - this.theta - theta
		}
		if(this.reloaded){
			target.takeHit(this.power)
			this.reloaded = false;
			this.fired = true;
		}
	},
	die : function(){
		Game.creeps.splice(Game.creeps.indexOf(this),1)
		var cell = Map.grid[this.gridX][this.gridY];
		cell.splice(cell.indexOf(this), 1);
		Game.money += this.price;
		this.dead = true
	}
})

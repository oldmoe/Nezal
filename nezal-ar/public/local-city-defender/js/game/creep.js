var Creep = Class.create(Unit,{
	speeds : [0, 1.08, 2.245, 4.852, 6.023, 7.945, 11.71, 22.625],
	angles : [0, 3.75, 7.5, 15, 18, 22.5, 30, 45],
	theta : 0, cannonTheta : 0,
	olderTheta : 0, oldestTheta: 0,
	hp : 100, maxHp : 100,
	speed : 8, price : 4,
	evading : false, direction : 0,
	rate : 0.2, power: 2.0,
	cannonDisplacement : [-4, 0],
	turningPoint : [0, 0],
	initialize : function($super, canvas, x, y, extension){
		$super(canvas, x, y,  extension)
		Map.grid[x][y].push(this);
		// find the nearest empty tile
		if(x == 0){
			this.theta = 0
			this.top = this.y - Map.entry[0][1] * Map.pitch
			this.bottom = (Map.entry[1][1] + 1) * Map.pitch- this.y
		}else if(y == 0){
			this.theta = 90
			this.top = (Map.entry[1][0] + 1) * Map.pitch - this.x					
			this.bottom = this.x - Map.entry[0][0] * Map.pitch
		}else if(x == (Map.width - 1)){
			
			this.theta = 180
			this.top = Map.entry[1][1] * Map.pitch - this.y					
			this.bottom = this.y - (Map.entry[0][1]+1) * Map.pitch
		}else if(y == Map.height - 1){
			this.theta = 270
			this.top = this.x - Map.entry[0][0] * Map.pitch
			this.bottom = (Map.entry[1][0] + 1) * Map.pitch - this.x					
		}		
//		this.initTraces();
	},
	
	topBottomValues : function(){
		if(this.theta == 0){
			return [Map.value(this.x, this.y - this.top - 1), Map.value(this.x, this.y + this.bottom + 1)]
		}else if(this.theta == 90){
			return [Map.value(this.x + this.top + 1, this.y), Map.value(this.x - this.bottom - 1, this.y)]
		}else if(this.theta == 180){
			return [Map.value(this.x - 1, this.y + this.top + 1), Map.value(this.x-1, this.y - this.bottom - 1)]
		}else if(this.theta == 270){
			return [Map.value(this.x - this.top - 1, this.y-1), Map.value(this.x + this.bottom + 1, this.y-1)]
		}
	},
	shouldNotTurn : function(ref){
		if(this.theta == 0){
			return this.x < (this.turningPoint[0] + ref - 16)
		}else if(this.theta == 90){
			return this.y < (this.turningPoint[1] + ref - 16)
		}else if(this.theta == 180){
			return this.x > (this.turningPoint[0] - ref + 16)
		}else if(this.theta == 270){
			return this.y > (this.turningPoint[1] - ref + 16)
		}
	},
	
	move : function(){
		if(this.dead) return
		var move = false
		if(!this.rotating){
			var values = this.topBottomValues()
			var top = values[0]
			var bottom = values[1]
			if(top == 0 && bottom == 0){
				move = true
				this.turningPoint = [0, 0]
			}else{
				if(this.turningPoint[0] == 0 && this.turningPoint[1] == 0){
					this.turningPoint = [this.x, this.y]
				}else if(bottom == 1 && (this.shouldNotTurn(this.bottom)) ){
					move = true
				}else if(top == 1 && (this.shouldNotTurn(this.top)) ){
					move = true
				}else{
					// we need to rotate now, which direction ?
					this.direction = bottom - top
					this.rotating = true
					this.oldTheta = this.theta
					this.oldSpeed = this.speed
					var self = this
					this.index = this.speeds.collect(function(speed, index){
						return [Math.abs(self.speed - speed), index];
					}).select(function(t){
						if(t[0] <= self.speed) return true
					}).sort(function(a, b){
						return a[0] - b[0];
					})[0][1]
					this.speed = this.speeds[this.index]
				}
			}
		}else{
			this.theta += this.direction * this.angles[this.index]
			move = false;
			this.x += this.speed * Math.cos(this.theta * Math.PI / 180 );
			this.y += this.speed * Math.sin(this.theta * Math.PI / 180 );
			if(Math.abs(this.theta - this.oldTheta) >= 90){
				this.theta = this.oldTheta + this.direction * 90 
				if(this.theta < 0) this.theta += 360;
				if(this.theta >= 360) this.theta -= 360;
				this.speed = this.oldSpeed
				this.rotating = false
				this.x = Math.round((this.x/4))*4
				this.y = Math.round((this.y/4))*4
				this.turningPoint = [0, 0]
				//move = true
			}
		}
		if(move){
			if(this.theta == 0){
				this.x += this.speed
			}else if(this.theta == 90){
				this.y += this.speed
			}else if(this.theta == 180){
				this.x -= this.speed
			}else if(this.theta == 270){
				this.y -= this.speed
			}
		}
		var newGridX = Math.floor(this.x / Map.pitch) 
		var newGridY = Math.floor(this.y / Map.pitch) 
		if(newGridX >= Map.width || newGridY >= Map.height || newGridX < 0 || newGridY < 0 ){
			Game.escaped += 1
			Game.creeps.splice(Game.creeps.indexOf(this), 1)
			var oldArr = Map.grid[this.gridX][this.gridY]
			oldArr.splice(oldArr.indexOf(this), 1);
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
		if(this.dead) return
		this.target();
		this.ctx.save()
		this.ctx.translate(Math.round(this.x), Math.round(this.y))
		this.ctx.rotate(Math.PI/180 * this.theta)
		this.ctx.drawImage(this.images.base, -48, -16)
		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(-22, 10, 3, -20)
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(-22, 10, 3, -20 * this.hp / this.maxHp)
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
		if(this.dead) return
		targets.sort(function(a,b){return a.hp - b.hp})
		var target = targets[0]
		var dx = this.x - target.x
		var dy = this.y - target.y
		var theta = Math.atan(dy/dx) *  180 / Math.PI 

		if(dx < 0){
			this.cannonTheta =  theta - this.theta 
		}else{
			this.cannonTheta =  theta - this.theta + 180
		}
		if(this.reloaded){
			target.takeHit(this.power)
			this.reloaded = false;
			this.fired = true;
		}
	},
	die : function(){
		Game.animations.push(new CoinsAnimation(this.ctx, this.x, this.y - 40))
		Game.score += this.maxHp
		Game.creeps.splice(Game.creeps.indexOf(this),1)
		var cell = Map.grid[this.gridX][this.gridY];
		cell.splice(cell.indexOf(this), 1);
		Game.money += this.price;
		this.dead = true
		Game.stats.creepsDestroyed++
	}
})
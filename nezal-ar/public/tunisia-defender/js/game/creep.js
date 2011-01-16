
var Creep = Class.create(Unit, {
	parent : "creep",
	speeds : [0, 1.08, 2.245, 4.852, 6.023, 7.945, 11.71, 22.625],
	angles : [0, 3.75, 7.5, 15, 18, 22.5, 30, 45],
	cannonTheta : 0,
	olderTheta : 0, oldestTheta: 0,
	hp : 100, maxHp : 100,
	speed :4, price : 4,
	evading : false, direction : 0,
	rate : 0.1, power: 1.0,
	cannonDisplacement : [-4, 0],
	turningPoint : [0, 0],
	range : 1,
	
	initialize : function($super,x,y,scene, extension){
		$super(x,y,scene,extension)
		Map.grid[x][y].push(this)
		// find the nearest empty tile
		if(x == 0){
			this.rotation = 0
			this.top = this.y - Map.entry[0][1] * Map.pitch
			this.bottom = (Map.entry[1][1] + 1) * Map.pitch- this.y
		}else if(y == 0){
			this.rotation = 90
			this.top = (Map.entry[1][0] + 1) * Map.pitch - this.x					
			this.bottom = this.x - Map.entry[0][0] * Map.pitch
		}else if(x == (Map.width - 1)){			
			this.rotation = 180
			this.bottom = this.y - Map.entry[0][1] * Map.pitch
			this.top = (Map.entry[1][1] + 1) * Map.pitch- this.y
		}else if(y == Map.height - 1){
			this.rotation = 270
			this.top = this.x - Map.entry[0][0] * Map.pitch
			this.bottom = (Map.entry[1][0] + 1) * Map.pitch - this.x					
		}		
	},
	
	topBottomValues : function(){
		if(this.rotation == 0){
			return [Map.value(this.x, this.y - this.top - 1), Map.value(this.x, this.y + this.bottom + 1)]
		}else if(this.rotation == 90){
			return [Map.value(this.x + this.top + 1, this.y), Map.value(this.x - this.bottom - 1, this.y)]
		}else if(this.rotation == 180){
			return [Map.value(this.x - 1, this.y + this.top + 1), Map.value(this.x-1, this.y - this.bottom - 1)]
		}else if(this.rotation == 270){
			return [Map.value(this.x - this.top - 1, this.y-1), Map.value(this.x + this.bottom + 1, this.y-1)]
		}
	},
	shouldNotTurn : function(ref){
		if(this.rotation == 0){
			return this.x < (this.turningPoint[0] + ref - 16)
		}else if(this.rotation == 90){
			return this.y < (this.turningPoint[1] + ref - 16)
		}else if(this.rotation == 180){
			return this.x > (this.turningPoint[0] - ref + 16)
		}else if(this.rotation == 270){
			return this.y > (this.turningPoint[1] - ref + 16)
		}
	},
	tick : function(){
		if(this.dead) return
		var move = false
		if(!this.rotating){
			var values = this.topBottomValues()
			var top = values[0]
			var bottom = values[1]
			if(top != 1 && bottom != 1){
				move = true
				this.turningPoint = [0, 0]
			}else{
				if(this.turningPoint[0] == 0 && this.turningPoint[1] == 0){
					this.turningPoint = [this.x, this.y]
					//move = true
				}else if(bottom == 1 && (this.shouldNotTurn(this.bottom)) ){
					move = true
				}else if(top == 1 && (this.shouldNotTurn(this.top)) ){
					move = true
				}else{
					// we need to rotate now, which direction ?
					var b = bottom > 1 ? 0 : bottom
					var t = top > 1 ? 0 : top
					this.direction = b - t
					this.rotating = true
					this.oldTheta = this.rotation
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
					this.rotation+= this.direction * this.angles[this.index]
					this.x += this.speed * Math.cos(this.rotation * Math.PI / 180 );
					this.y += this.speed * Math.sin(this.rotation * Math.PI / 180 );
				}
			}
		}else{		
			this.rotation+= this.direction * this.angles[this.index]
			this.x += this.speed * Math.cos(this.rotation * Math.PI / 180 );
			this.y += this.speed * Math.sin(this.rotation * Math.PI / 180 );
			if(Math.abs(this.rotation - this.oldTheta) >= 90){
				this.rotation = this.oldTheta + this.direction * 90 
				if(this.rotation < 0) this.rotation += 360;
				if(this.rotation >= 360) this.rotation -= 360;
				this.speed = this.oldSpeed
				this.rotating = false
				this.x = Math.round((this.x/4))*4
				this.y = Math.round((this.y/4))*4
				this.turningPoint = [0, 0]
			}
		}
		if(move){
			if(this.rotation == 0){
				this.x += this.speed
			}else if(this.rotation == 90){
				this.y += this.speed
			}else if(this.rotation == 180){
				this.x -= this.speed
			}else if(this.rotation == 270){
				this.y -= this.speed
			}
		}
		var newGridX = Math.floor(this.x / Map.pitch) 
		var newGridY = Math.floor(this.y / Map.pitch) 
		if(newGridX >= Map.width || newGridY >= Map.height || newGridX < 0 || newGridY < 0 ){
			this.scene.escaped += 1
			this.destroy()
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
		this.target();			//for specifying the target to hit
	},
	getTargetfromCell: function(cell, targets){
		if(cell.tower){
			targets.push(cell.tower)
		}
	},
	
	pickTarget: function(targets){
		if(this.dead) return
		targets.sort(function(a,b){return a.hp - b.hp})
		var target = targets[0]
		var dx = this.x - target.x
		var dy = this.y - target.y
		var theta = Math.atan(dy/dx) *  180 / Math.PI 

		if(dx < 0){
			this.cannonTheta =  theta - this.rotation 
		}else{
			this.cannonTheta =  theta - this.rotation + 180
		}
		if(this.reloaded){
			target.takeHit(this.power)
			if(target.dead&&this.scene.scenario)this.scene.scenario.notify({name:"creepDestroyedTower", method: false, unit:this})
			this.reloaded = false;
			this.fired = true;
		}
	},
	die : function(){
		this.destroy()
		this.killed = true
		this.scene.money += Math.round(this.price);
		this.scene.stats.creepsDestroyed++
		this.scene.score += Math.round(this.maxHp/20)*this.scene.config.level
	},
	destroy : function(){
		var cell = Map.grid[this.gridX][this.gridY];
		cell.splice(cell.indexOf(this), 1);
		this.dead = true
	}
})	

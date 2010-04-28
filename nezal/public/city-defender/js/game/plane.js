var Plane = Class.create(Creep, {
	flying : true,
	images : {
		base : Game.images['air_craft.png'],
		fire : Game.images['air_craft_in_action.png'],
		shadow : Game.images['air_craft_shade.png']
	},	
	move : function(){
		this.x += this.speed * Math.cos(this.theta * Math.PI / 180)
		this.y += this.speed * Math.sin(this.theta * Math.PI / 180)
		var newGridX = Math.floor((this.x) / Map.pitch)
		if(this.gridX >= Map.width){
			// we are out, take us from the game
			if(this.x >= (Map.width * Map.pitch + Map.pitch / 2)){
				Game.escaped += 1
				Game.planes.splice(Game.planes.indexOf(this), 1)
			}			
		}else if(this.gridX != newGridX){
			var oldArr = Map.grid[this.gridX][this.gridY]
			oldArr.splice(oldArr.indexOf(this), 1);
			this.gridX = newGridX
			if(newGridX < Map.width){
				Map.grid[newGridX][this.gridY].push(this);
			}else{
				// we are going out, do nothing for now;
			}
		}
	
	},
	
	render : function(){
		this.target();
		this.ctx.save()
		this.ctx.translate(this.x, this.y)
		this.ctx.globalAlpha = 0.6;
		this.ctx.drawImage(this.images.shadow, -30, -5)
		this.ctx.globalAlpha = 1;
		if(this.fired){
			this.ctx.drawImage(this.images.fire, -15, -16)
			this.fired = false
		}else{
			this.ctx.drawImage(this.images.base, -15, -16)
		}
		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(-12, -20, 24, 3)
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(-12, -20, 24 * this.hp / this.maxHp, 3)
		this.ctx.restore();		
	},
	
	die : function(){
		Game.animations.push(new CoinsAnimation(this.ctx, this.x, this.y - 40))
		Game.planes.splice(Game.planes.indexOf(this),1)
		if(Map.grid[this.gridX] && Map.grid[this.gridX][this.gridY]){
			var cell = Map.grid[this.gridX][this.gridY];
			cell.splice(cell.indexOf(this), 1);
		}
		Game.money += this.price;
		this.dead = true	
		Game.stats.creepsDestroyed++
	}
})
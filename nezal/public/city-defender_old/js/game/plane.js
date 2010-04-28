var Plane = Class.create(Creep, {
	flying : true,
	images : {
		base : cityDefenderImages['air_craft.png'],
		fire : cityDefenderImages['air_craft_in_action.png'],
		shadow : cityDefenderImages['air_craft_shade.png']
	},		
	initTraces : function(){
	},
	
	move : function(){
		this.x += this.speeds[this.speed]
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
		this.ctx.drawImage(this.images.shadow, -56, -5)
		if(this.fired){
			this.ctx.drawImage(this.images.fire, -48, -16)
			this.fired = false
		}else{
			this.ctx.drawImage(this.images.base, -48, -16)
		}
		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(-48, -20, 24, 3)
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(-48, -20, 24 * this.hp / this.maxHp, 3)
		this.ctx.restore();		
	},
	
	die : function(){
		Game.planes.splice(Game.planes.indexOf(this),1)
		var cell = Map.grid[this.gridX][this.gridY];
		cell.splice(cell.indexOf(this), 1);
		Game.money += this.price;
		this.dead = true	
	}
	
})

var Plane = Class.create(Creep, {
	flying : true,
	images : {
		base : Loader.images.game['air_craft.png'],
		fire : Loader.images.game['air_craft_in_action.png'],
		shadow : Loader.images.game['air_craft_shade.png']
	},
	initialize : function($super,x,y,extension){
		$super(x,y,extension)
		this.theta = 0
	},	
	createSprites : function(){
		this.cannonSprite = new Sprite([this.images.base,this.images.fire])
		this.shadowSprite = new Sprite([this.images.shadow])
		this.healthSprite = new HealthSprite(this.hp,this.maxHp)
		this.cannonSprite.moveTo(this.x,this.y)
		this.shadowSprite.moveTo(this.x,this.y)
		this.healthSprite.moveTo(this.x,this.y)
		
	},
	modifySprites: function(){
		this.cannonSprite.moveTo(this.x+30,this.y)
		this.shadowSprite.moveTo(this.x+30,this.y)
		this.healthSprite.moveTo(this.x,this.y)
		this.healthSprite.hp = this.hp
		if(this.fired){
			this.cannonSprite.currentFrame = 1
			this.fired = false
		}else{
			this.cannonSprite.currentFrame = 0
		}
	},
	tick : function(){
		this.x += this.speed * Math.cos(this.theta * Math.PI / 180)
		this.y += this.speed * Math.sin(this.theta * Math.PI / 180)
		var newGridX = Math.floor((this.x) / Map.pitch)
		if(this.gridX >= Map.width){
			// we are out, take us from the game
			if(this.x >= (Map.width * Map.pitch + Map.pitch / 2)){
				game.escaped += 1
				this.destroySprites()
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
		this.target();
		this.modifySprites()
	},
	
	
	die : function(){
		console.log('will die')
		this.destroySprites()
		console.log('dying')
		if(Map.grid[this.gridX] && Map.grid[this.gridX][this.gridY]){
			console.log('removing')
			var cell = Map.grid[this.gridX][this.gridY];
			console.log(cell)
			var res = cell.splice(cell.indexOf(this), 1);
			console.log(res)
			console.log(this.gridX, this.gridY)
			console.log(cell)
		}
		game.money += this.price;
		game.stats.creepsDestroyed++
	},
	destroySprites : function(){
		this.dead = true	
		this.cannonSprite.destroy()
		this.shadowSprite.destroy()
		this.healthSprite.destroy()
	}
	
})

var RedPlane = Class.create(Plane, {

	images : {
		base : Loader.images.game['red_air_craft.png'],
		fire : Loader.images.game['red_air_craft_in_action.png'],
		shadow : Loader.images.game['air_craft_shade.png']
	}

})	

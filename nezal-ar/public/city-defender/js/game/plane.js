var Plane = Class.create(Creep, {
	name : 'Plane',
	flying : true,
	hp:60,maxHp:60,speed:6, power:2, rate:0.1, range: 3,
	initialize : function($super,x,y,extension){
		$super(x,y,extension)
		this.theta = 0
	},
	initImages : function(){
		this.images = {
		base : Loader.images.game['air_craft.png'],
		fire : Loader.images.game['air_craft_in_action.png'],
		shadow : Loader.images.game['air_craft_shade.png']
		}
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
				this.scene.escaped += 1
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
		this.destroySprites()
		if(Map.grid[this.gridX] && Map.grid[this.gridX][this.gridY]){
			var cell = Map.grid[this.gridX][this.gridY];
			var res = cell.splice(cell.indexOf(this), 1);
		}
		this.scene.money += this.price;
		this.scene.stats.creepsDestroyed++
	},
	destroySprites : function(){
		this.dead = true	
		this.cannonSprite.destroy()
		this.shadowSprite.destroy()
		this.healthSprite.destroy()
	}
	
})

var RedPlane = Class.create(Plane, {
	speed : 7,power:4, rate:0.2, range: 3,
   initImages : function(){
		this.images = {
			base : Loader.images.game['red_air_craft.png'],
			fire : Loader.images.game['red_air_craft_in_action.png'],
			shadow : Loader.images.game['air_craft_shade.png']
		}
	}

})	

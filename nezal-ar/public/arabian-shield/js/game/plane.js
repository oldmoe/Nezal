var Plane = Class.create(Creep, {
	name : 'Plane',parent : 'Plane',
	flying : true,
	hp:125,maxHp:125,speed:4, power:1, rate:0.1, range: 2,price:2,
	initialize : function($super,x,y,extension){
		$super(x,y,extension)
		this.x = 0
		this.theta = 0
	},
	tick : function(){
		this.x += this.speed * Math.cos(this.theta * Math.PI / 180)
		this.y += this.speed * Math.sin(this.theta * Math.PI / 180)
		var newGridX = Math.floor((this.x) / Map.pitch)
		if(this.gridX >= Map.width){
			// we are out, take us from the game
			if(this.x >= (Map.width * Map.pitch + Map.pitch / 2)){
				this.scene.escaped += 1
				this.destroy()
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
	},
	
	
	die : function(){
		//var anim = new CoinsAnimation(this.x, this.y - 40)
		//this.scene.towerHealthLayer.attach(anim)
		//this.scene.objects.push(anim)
		//var moneyAnim = new MoneyAnimation(this.x-10,this.y-5,Math.floor(this.price))
		//this.scene.objects.push(moneyAnim)
		if(Map.grid[this.gridX] && Map.grid[this.gridX][this.gridY]){
			var cell = Map.grid[this.gridX][this.gridY];
			var res = cell.splice(cell.indexOf(this), 1);
		}
		this.scene.money += Math.round(this.price);
		this.scene.stats.creepsDestroyed++
		this.scene.score += Math.round(this.maxHp/20)*this.scene.config.level
	},
	destroy : function(){
		this.dead = true
	}
})

var RedPlane = Class.create(Plane, {
	hp:125,maxHp:125,speed : 6,power:1, rate:0.1, range: 2,price:3
})	

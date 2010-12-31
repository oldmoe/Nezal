var Worker = Class.create({
	 coords : null,
	 moving : false ,
	 rotating : false,
	 targetAngle :0,
	 angle : 0,
	 speed : 0.5,
	 initialize : function(game,x,y){
	 	this.game = game
		this.coords = {}
	 	this.coords.x = x
		this.coords.y = y
		this.movingPath = []
		this.game.scene.push(this);
	 },
	 tick : function(){
	 		if(this.movingPath.length>0){
			if(this.targetAngle!=this.angle){
				if(this.angle > this.targetAngle){
					if((this.targetAngle+8) - this.angle < this.angle - this.targetAngle){
						this.angle = (this.angle+1) % 8 
					}else{
						this.angle = (this.angle+7) % 8
					}
				}else{
					if(this.targetAngle - this.angle < (this.angle+8) - this.targetAngle){
						this.angle = (this.angle+1) % 8 
					}else{
						this.angle = (this.angle+7) % 8
					}
				}	
				return
			}
			var values = Map.value(this.movingPath[this.movingPath.length-1].x,this.movingPath[this.movingPath.length-1].y)
			if(!this.moving){
				this.moving = true
				this.targetAngle = Map.getDirection(this.coords.x,this.coords.y,values[0],values[1])
			}
			var movements = Util.getNextMove(this.coords.x,this.coords.y,values[0],values[1],this.speed)
			this.coords.x+=movements[0]
			this.coords.y+=movements[1]
			var mapValues = Map.tileValue(this.coords.x,this.coords.y)
			if(this.coords.x == values[0] && this.coords.y == values[1]){
				this.movingPath.pop()
				if(this.movingPath.length>0){
					values = Map.value(this.movingPath[this.movingPath.length-1].x,this.movingPath[this.movingPath.length-1].y)
					this.targetAngle = Map.getDirection(this.coords.x,this.coords.y,values[0],values[1])
					//this.angle = Map.getDirection(this.x,this.y,values[0],values[1])
				}
			}
			if(this.movingPath.length == 0) this.moving = false
		}
		else {
			var rand = Math.random()
			if (rand <= 0.05) {
		  	var x = Math.round(game.scene.map.x + game.scene.map.viewWidth * Math.random())
		  	var y = Math.round(game.scene.map.y + game.scene.map.viewHeight * Math.random())
		  	Map.moveObject(this, x, y)
	  	}
		}
	}
});
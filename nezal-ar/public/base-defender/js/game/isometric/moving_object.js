var MovingObject = Class.create({
	 coords : null,
	 moving : false ,
	 rotating : false,
	 targetAngle :0,
	 angle : 0,
	 speed : 0.7,
	 distanceToNextTile : 0,
	 noOfStates : 8,
	 state : 0,
	 counter : 0,
	 initialize : function(game,x,y){
	 	this.game = game
		this.coords = {}
	 	this.coords.x = x
		this.coords.y = y
		this.shadow = {xdim: 40, ydim: 40, zdim: 0, imgWidth: 50, imgHeight: 31, angle:0};
		this.shadow.coords = this.coords
		this.movingPath = []
		this.game.scene.push(this);
	 },
	 
	 tick : function(){
	 		this.counter++
	 		if(this.movingPath.length>0){
			if(this.targetAngle!=this.angle){
				this.changeAngle();
				return
			}
			var values = Map.value(this.movingPath[this.movingPath.length-1].x,this.movingPath[this.movingPath.length-1].y)
			if(!this.moving){
				this.moving = true
				this.distanceToNextTile = Util.distance(this.coords.x,this.coords.y,values[0],values[1])  
				this.targetAngle = Map.getDirection(this.coords.x,this.coords.y,values[0],values[1])
			}
			//this.state = this.calculateCurrentState(values)
			var movements = Util.getNextMove(this.coords.x,this.coords.y,values[0],values[1],this.distanceToNextTile/24)
			if(this.counter%3==0)this.state = (this.state+1)%8
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
			if(this.movingPath.length == 0){
				this.moving = false
				this.state = 0
			} 
		}
		else {
			var rand = Math.random()
			if (rand <= 0.05) {
		  	var x = Math.round(game.scene.map.x + game.scene.map.viewWidth * Math.random())
		  	var y = Math.round(game.scene.map.y + game.scene.map.viewHeight * Math.random())
		  	Map.moveObject(this, x, y)
	  	}
		}
	},
	changeAngle : function(){
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
	},
	calculateCurrentState : function(values){
		var numirator = (this.distanceToNextTile - Util.distance(this.coords.x,this.coords.y,values[0],values[1]))*this.noOfStates
		return Math.round(numirator/this.distanceToNextTile)
	}
})

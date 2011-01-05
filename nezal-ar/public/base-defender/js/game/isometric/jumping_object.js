var JumpingObject = Class.create({
	 coords : null,
	 moving : false ,
	 randomMove : false,
	 rotating : false,
	 targetAngle :0,
	 angle : 0,
	 speed : 4,
	 acceleration : 0.5,
	 jumpDirections :{UP : 0, DOWN :1},
	 jumpDirection : 0,
	 oneJumpFinshed : true,
	 doingJump : false, 
	 minSpeed : 1.5,
	 maxSpeed : 4,
	 initialize : function(game,x,y){
	 	this.game = game;
		this.coords = {};
	 	this.coords.x = x;
		this.coords.y = y;
		this.shadow = {xdim: 40, ydim: 40, zdim: 0, imgWidth: 40, imgHeight: 40};
		this.shadow.coords = {x:this.coords.x, y:this.coords.y};
		this.movingPath = [];
		this.game.scene.push(this);
	 },
	 
	 tick : function(){
	 	if(this.movingPath.length>0){
			if (!this.doingJump) {
				this.moving = true
				var values = Map.value(this.movingPath[this.movingPath.length-1].x,this.movingPath[this.movingPath.length-1].y)
				this.targetAngle = Map.getDirection(this.coords.x,this.coords.y,values[0],values[1])
		  	if (this.targetAngle && this.targetAngle != this.angle) {
		  		this.changeAngle();
		  		return
		  	}
		  }
			
			if(!this.doingJump){
				this.doingJump = true;
				this.speed = this.maxSpeed;
				var jmpTile = this.getJumpTile();
				if(jmpTile!=null)this.movingPath.push(this.getJumpTile());
			}
			
			var values = Map.value(this.movingPath[this.movingPath.length-1].x,this.movingPath[this.movingPath.length-1].y)
			var movements = Util.getNextMove(this.coords.x,this.coords.y,values[0],values[1],this.speed)
			this.coords.x+=movements[0]
			this.coords.y+=movements[1]

			if (this.movingPath[this.movingPath.length - 2]) {
	  		var shadowValues = Map.value(this.movingPath[this.movingPath.length - 2].x, this.movingPath[this.movingPath.length - 2].y)
				var shadowSpeed = 2
				if(this.angle == Map.N) shadowSpeed = 1;
	  		var shadowMovements = Util.getNextMove(this.shadow.coords.x, this.shadow.coords.y, shadowValues[0],
																								 shadowValues[1],shadowSpeed);
				this.shadow.coords.y += shadowMovements[1];
	  	}else{
				
			}
			this.shadow.coords.x = this.coords.x;
			
			
			if(this.jumpDirection == this.jumpDirections.UP) this.speed = Math.max(this.minSpeed, this.speed-this.acceleration);
			else if(this.jumpDirection == this.jumpDirections.DOWN) this.speed = Math.min(3,this.speed+this.acceleration);

			var DirectionMtliplier = 1;
			if (this.angle == Map.N || this.angle == Map.NE || this.angle == Map.NW) {
	  		DirectionMtliplier = 2;
	  	}
			var cond1 = (this.coords.x < values[0] + DirectionMtliplier*10) && (this.coords.x > values[0]-DirectionMtliplier*10) 
			&& (this.coords.y < values[1] + DirectionMtliplier*10) && (this.coords.y > values[1] - DirectionMtliplier*10);
			var cond2 = this.coords.x == values[0] && this.coords.y == values[1];

			
			var mapValues = Map.tileValue(this.coords.x,this.coords.y);
			if((cond1 && this.jumpDirection == this.jumpDirections.UP) ||(cond2 && this.jumpDirection == this.jumpDirections.DOWN)){
				if (this.jumpDirection == this.jumpDirections.DOWN) {
					this.doingJump = false;
					this.shadow.coords.y = this.coords.y;
				}
				this.jumpDirection = (this.jumpDirection + 1) % 2;
				this.movingPath.pop();
				if(this.movingPath.length>0){
					values = Map.value(this.movingPath[this.movingPath.length-1].x,this.movingPath[this.movingPath.length-1].y)
					this.targetAngle = Map.getDirection(this.coords.x,this.coords.y,values[0],values[1])
				}
			}
			if(this.movingPath.length == 0) this.moving = false
		}
		else if(this.randomMove){
		  	var x = Math.round(game.scene.map.x + game.scene.map.viewWidth * Math.random())
		  	var y = Math.round(game.scene.map.y + game.scene.map.viewHeight * Math.random())
		  	Map.moveObject(this, x, y)
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
	
	getJumpTile : function(){
		var mapValues = [this.movingPath[this.movingPath.length-1].x, this.movingPath[this.movingPath.length-1].y];
		var currentMapValues = Map.tileValue(this.coords.x,this.coords.y);
		var jumpTile = null;
		switch(this.angle){
			case Map.N:
				jumpTile =	Map.getNeighbor(mapValues[0], mapValues[1], Map.N);
				break;
			case Map.S:
				jumpTile =	Map.getNeighbor(currentMapValues[0], currentMapValues[1], Map.N);
				break;
			case Map.E:
				jumpTile =	Map.getNeighbor(currentMapValues[0], currentMapValues[1], Map.NE);
				break;
			case Map.W:
				jumpTile =	Map.getNeighbor(currentMapValues[0], currentMapValues[1], Map.NW);
				break;
			case Map.NE:
				jumpTile = Map.getNeighbor(mapValues[0], mapValues[1], Map.N);
				break;
			case Map.NW:
				jumpTile = Map.getNeighbor(mapValues[0], mapValues[1], Map.N);
				break;
			case Map.SE:
				jumpTile = Map.getNeighbor(currentMapValues[0], currentMapValues[1], Map.NE);
				break;
			case Map.SW:
				jumpTile = Map.getNeighbor(currentMapValues[0], currentMapValues[1], Map.NW);
				break;
		}
		if(jumpTile)return {x:jumpTile[0],y:jumpTile[1]};
		return null;
	}
	
})

var Unit = Class.create({
	 x:0,
	 y:0,
	 xdim:0,
	 ydim:0,
	 zdim:0,
	 imgWidth : 0,
	 imgHeight :0,
	 lengthMultiplier : 17,
	 goalX : 0,
	 goalY : 0,
	 speed:2,
	 moving : false ,
	 rotating : false,
	 targetAngle :0,
	 angle : 0,
	 initialize : function(){
		this.mapTiles =[]
		this.movingPath = []
	 },
	 collides : function(u){
		return Util.collision(this,u)
	 },
	 distance : function(u){
		return Math.sqrt(Math.pow(u.x-this.x,2)+Math.pow(u.y-this.y,2))
	 },
	 getNextMove : function(){
		if(this.x!=this.goalX || this.y!=this.goalY){
			var movement = Util.getNextMove(this.x,this.y,this.goalX,this.goalY,this.speed)
		}
	 },
	 update : function(){
		this.A = [this.x,this.y-this.ydim/2+this.zdim]
		this.B = [this.x-this.xdim/2,this.y+this.zdim/2]
		this.C = [this.x,this.y+this.ydim/2]
		this.D = [this.x+this.xdim/2,this.y+this.zdim/2]
	},
	tick :function(){
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
				this.sprite.render()
				return
			}
			var values = Map.value(this.movingPath[this.movingPath.length-1].x,this.movingPath[this.movingPath.length-1].y)
			if(!this.moving){
				this.moving = true
				this.targetAngle = Map.getDirection(this.x,this.y,values[0],values[1])
				//this.angle = Map.getDirection(this.x,this.y,values[0],values[1])
			}
			var movements = Util.getNextMove(this.x,this.y,values[0],values[1],this.speed)
			this.x+=movements[0]
			this.y+=movements[1]
			var mapValues = Map.tileValue(this.x,this.y)
			//if(this.movingPath[this.movingPath.length-1].x == mapValues[0] && this.movingPath[this.movingPath.length-1].y == mapValues[1]){
			if(this.x == values[0] && this.y == values[1]){
				this.movingPath.pop()
				if(this.movingPath.length>0){
					values = Map.value(this.movingPath[this.movingPath.length-1].x,this.movingPath[this.movingPath.length-1].y)
					this.targetAngle = Map.getDirection(this.x,this.y,values[0],values[1])
					//this.angle = Map.getDirection(this.x,this.y,values[0],values[1])
				}
			}
			if(this.movingPath.length == 0) this.moving = false
		}
		else {
			
		}
		this.sprite.render()
	}
})

var Cube = Class.create(Unit,{

	initialize : function($super){
		$super()
		this.zdim=10
		this.imgWidth=74
		this.ydim=47
		this.img = new Image
		this.img.src="suelo2.gif"
	}
})
var HoverCube = Class.create(Unit,{
	initialize : function($super){
		$super()
		this.zdim=10
		this.imgWidth=74
		this.imgHeight=47
		this.img = new Image
		this.img.src="images/pj.gif"
	}
})
var Tank = Class.create(Unit,{
	initialize : function($super){
		$super()
		this.zdim=0
		this.imgWidth=64
		this.imgHeight=46
		this.img = new Image
		this.img.src="images/creep.png"
		this.sprite = new DomSprite(this, this.img)
	}
})

//var Display = Class.create({
//	initialize : function(owner){
//		this.owner = owner;
//	},
//	update : function(){},
//	finish : function(){}
//})
//
//var TownHallDisplay = Class.create(Display{
//	initialize : function(owner){
//		this.xdim = 
//		this.ydim = 
//		this.zdim = 
//		this.imgWidth = 
//		this.imgHeight = 
//		this.img = new Image
//		this.img.src = "townhall.png"
//		this.owner = owner
//		this.sprite = new DomSprite(this.owner,this.img)
//	},
//	update : function(){
//	},
//	finish(){
//	
//	}
//})
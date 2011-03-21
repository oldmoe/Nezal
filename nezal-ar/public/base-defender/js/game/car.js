var Car = Class.create(MovingObject,{
	hp:100, range:4, power:3,
	maxHp : 100,
	speed : 3, 
	name: "car",
	targetLocated : false,
	mapDirection : Map.N, 
	done_attack : false,
	attacked : false,
	initialize : function(game){
		this.target = null
		this.hitting = false
		this.game = game
		this.coords = {}
		this.setInitialCoords()
		this.movingPath = []
		this.startHittingObservers = []
		this.finishHittingObservers = []
	},
	
	tick : function($super){
		if(this.hp <=0 ){
			this.done_attack = true
			this.hitting = false
			this.game.attackManager.notifyDoneAttack()
			this.game.creepFactory.remove(this)
			return
		}  
		if(!this.target){
			this.hitting = false
			this.target = this.pickTarget()
		}
		if (!this.target) {
			this.done_attack = true
			this.hitting = false
			this.game.attackManager.notifyDoneAttack()
			this.game.creepFactory.remove(this)
			return
		}
		$super()
		if(this.target && this.movingPath.length == 0){
			this.hitting = true
			this.notifyStartHitting()
			this.angle = Map.getGeneralDirectoin(this.coords.x, this.coords.y, this.target.coords.x, this.target.coords.y);
			this.target.hp -=this.power
			this.attacked = true
		}else{
			this.hitting = false
			this.notifyFinishHitting()
		}
		if (this.target.hp <= 1) {
			this.target.hp = 1
			this.target.working = false
			this.target.setState(this.target.states.NORMAL)
			this.target = null
		} 
	},
		
	pickTarget : function(){
		var minIndex = -1
		var minDistance = 9999999
		for(var i=0;i<Map.objects.length;i++){
			if(Map.objects[i].hp<=1)continue;
			var building = Map.objects[i] 
			var distanceToBuilding = Util.distance(this.coords.x,this.coords.y,building.coords.x,building.coords.y)
			if(distanceToBuilding < minDistance){
				minDistance = distanceToBuilding
				minIndex = i
			}
		}
		if(minIndex==-1){
			return null
		}
		var edges = this.getBuildingAttackPoints(Map.objects[minIndex])
		var minEdges = []
		for (j = 0; j < 2; j++) {
			var minDistance = 9999999
			var minEdge = -1
			for (var i = 0; i < edges.length; i++) {
				var edge = edges[i]
				var d = Util.distance(this.coords.x, this.coords.y, edge.x, edge.y)
				if (d < minDistance) {
					minDistance = d;
					minEdge = i;
				}
			}
			minEdges.push(edges[minEdge])
			edges.remove(edges[minEdge])
		}
		this.targetEdge = minEdges.random()
		this.movingPath = Map.moveObject(this, this.targetEdge.x , this.targetEdge.y)
		this.targetLocated = true
		return Map.objects[minIndex]
	},
	
	
	getBuildingAttackPoints : function(obj){
			var edges = []
			var origin = {
	  		x: obj.coords.x - obj.imgWidth / 2,
		  	y: obj.coords.y - obj.imgHeight / 2
	  	}
			var left = Math.sin(Util.degToRad(Map.tileAngle))* obj.xdim
			var right = Math.sin(Util.degToRad(Map.tileAngle))* obj.ydim
		//	edges.push({x:origin.x,y:left+obj.zdim})
			edges.push({x:origin.x+obj.imgWidth/4, y:origin.y+obj.zdim+left/2})
		//	edges.push({x:origin.x+obj.imgWidth/2, y:origin.y+obj.zdim})
			edges.push({x:origin.x+obj.imgWidth*3/4, y:origin.y+obj.zdim+right/2})
		//	edges.push({x:origin.x+obj.imgWidth, y:origin.y+right+obj.zdim})
			edges.push({x:origin.x+obj.imgWidth*3/4, y:origin.y+right*3/2+obj.zdim})
		//	edges.push({x:origin.x+obj.imgWidth/2, y:origin.y+2*left+obj.zdim})
			edges.push({x:origin.x+obj.imgWidth/4, y:origin.y+obj.zdim+left*3/2})
			return edges
	},
	
	setInitialCoords : function(){
		switch(this.mapDirection){
			case Map.E:
				this.coords.x = Map.x;
				this.coords.y = Map.y + Math.round*Map.viewHeight* Math.random()
				break;
			case Map.W:
				this.coords.x = Map.x + Map.viewWidth;
				this.coords.y = Map.y + Math.round(Map.viewHeight* Math.random())
				break;
			case Map.N:
				this.coords.x = Map.x + Math.round(Map.viewWidth * Math.random());
				this.coords.y = Map.y
				break;
			case Map.S:
				this.coords.x = Map.x + Math.round(Map.viewWidth * Math.random());
				this.coords.y = Map.y + Map.viewHeight
				break;
			case Map.NE:
				this.coords.x = Map.x + Map.viewWidth
				this.coords.y = Map.y
				break;
			case Map.NW:
				this.coords.x = Map.x
				this.coords.y = Map.y
				break;
			case Map.SE:
				this.coords.x = Map.x + Map.viewWidth
				this.coords.y = Map.y + Map.viewHeight
				break;
			case Map.SW:
				this.coords.x = Map.x
				this.coords.y = Map.y + Map.viewHeight
				break;
			default: 
				break;		
		}
		var mapCoords = Map.tileValue(this.coords.x,this.coords.y)
		var realValues = Map.value(mapCoords[0], mapCoords[1])
		this.coords.x =  realValues[0]
		this.coords.y = realValues[1]
	},
	notifyStartHitting : function(){
		this.startHittingObservers.each(function(observer){
			observer()
		})
	},
	notifyFinishHitting : function(){
		this.finishHittingObservers.each(function(observer){
			observer()
		})
	}	
})


var Car = Class.create(MovingObject,{
	hp:100, range:4, power:10,
	speed : 3, 
	name: "car",
	targetLocated : false,
	target : null,
	mapDirection : Map.N, 
	initialize : function(){
		this.coords = {}
		this.setInitialCoords()
		this.movingPath = []
	},
	
	tick : function($super){
		if(!this.target){
			this.target = this.pickTarget()	
		}
		if(!this.target)return
		$super()
		if(this.target && this.movingPath.length == 0){
			this.target.hp -=this.power
		}
		if (this.target.hp <= 1) {
			this.target.hp = 1
			this.target = null
		} 
	},
	
	pickTarget : function(){
		var minIndex = -1
		var minDistance = 9999999
		for(var i=0;i<Map.objects.length;i++){
			if(Map.objects[i].hp<=0)continue;
			var building = Map.objects[i] 
			var distanceToBuilding = Util.distance(this.coords.x,this.coords.y,building.coords.x,building.coords.y)
			if(distanceToBuilding < minDistance){
				minDistance = distanceToBuilding
				minIndex = i
			}
		}
		if(minIndex==-1) return null
		Map.moveObject(this, Map.objects[minIndex].coords.x , Map.objects[minIndex].coords.y)
		this.targetLocated = true
		return Map.objects[minIndex]
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
	}	
})

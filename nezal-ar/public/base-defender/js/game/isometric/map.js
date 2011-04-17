var Map={
	scene : null,
	tileWidth:64,
	tileHeight:31,
	viewWidth:760,
	viewHeight:550,
	mapWidth : 1000,
	mapHeight : 1000,	
	hoverX :0,
	hoverY :0,
	x:380,y:275,
	speed:2,
	origin:[0,0],
	movementSpeed : 8,
	rowEvenDirections : {},
	rowOddDirections : {},
	objects : [],
	inViewObjects : [],
	init : function (scene){
		this.scene = scene;
		var rawMap = scene.rawMap;
		this.grid=[];
			for(var i=0;i<rawMap.length;i++){
					for(var j=0;j<rawMap[0].length;j++){
						if(!Map.grid[i])Map.grid[i]=[];
						Map.grid[i][j] = new Node(i,j);
						Map.grid[i][j].terrainType = rawMap[i][j];
						if(Map.grid[i][j].terrainType != 0){
							scene.renderDisplayUnit(Map.value(i, j), rawMap[i][j]);
					}
				}
			}			
			Map.navigation = new Navigation(Map);
			Map.mapMirror = new MapMirror();
			Map.initDirections()
			Map.tileIsoLength = Math.sqrt(Math.pow(Map.tileWidth/2,2)+Math.pow(Map.tileHeight/2,2))/2
			Map.tileAngle = Map.getTileAngle()
	},
	
	initializeMapSize : function(){
		this.containerDiv = $("gameSceneContainer")
		this.div = $('gameCanvas');
		this.div.style.backgroundImage = "url(images/game_elements/background.png)"
		Map.containerDiv.style.width = Map.viewWidth + "px";
		Map.containerDiv.style.height = Map.viewHeight + "px";
		var backgroundImg = Loader.images.game_elements['background.png'];
		Map.div.style.width  =  backgroundImg.width + "px";
		Map.mapWidth = backgroundImg.width;
		Map.div.style.height =  backgroundImg.height + "px";
		Map.mapHeight = backgroundImg.height;
		Map.centerMap(1)
	},
	centerMap : function(zoomFactor){
		Map.x = 0
		Map.y=0
		Map.move(Map.mapWidth/2-Map.viewWidth/2,Map.mapHeight/2-Map.viewHeight/2)
	},
	
	initDirections : function(){
		Map.rowEvenDirections[Map.N]=[-2,0]
		Map.rowEvenDirections[Map.S]=[2,0]
		Map.rowEvenDirections[Map.E]=[0,1]
		Map.rowEvenDirections[Map.W]=[0,-1]
		Map.rowEvenDirections[Map.NE]= [-1,0]
		Map.rowEvenDirections[Map.NW]=[-1,-1] 
		Map.rowEvenDirections[Map.SE]=[1,0]
		Map.rowEvenDirections[Map.SW]=[1,-1]
		Map.rowOddDirections[Map.N]=[-2,0]
		Map.rowOddDirections[Map.S]=[2,0]
		Map.rowOddDirections[Map.E]=[0,1]
		Map.rowOddDirections[Map.W]=[0,-1]
		Map.rowOddDirections[Map.NE]=[-1,1]
		Map.rowOddDirections[Map.NW]=[-1,0]
		Map.rowOddDirections[Map.SE]=[1,1]
		Map.rowOddDirections[Map.SW]=[1,0]
	},
  getGeneralDirectoin : function(x1,y1,x2,y2) {
    var dir = 0
    var slope = Math.round((y1-y2)/(x1-x2))
    if(slope == "Infinity")
      dir = Map.N;
    else if (slope == "-Infinity" )
      dir = Map.S;
    else if(slope == 0 && x1 > x2)
      dir = Map.W
    else if(slope == 0 && x1 < x2)
      dir = Map.E
    else if(slope == -1 && x1 < x2)
      dir = Map.NE
    else if(slope < -1 && x1 < x2)
      dir = Map.N
    else if(slope == -1 && x1 > x2)
      dir = Map.SW
    else if(slope < -1 && x1 > x2)
      dir = Map.S
    else if(slope == 1 && x1 > x2)
      dir = Map.NW
    else if(slope > 1 && x1 > x2)
      dir = Map.N
    else if(slope == 1 && x1 < x2)
      dir = Map.SE
    else if(slope > 1 && x1 < x2)
      dir = Map.S
    return dir;
  },
	getTileAngle : function(){
		var a = Math.sqrt(Math.pow(Map.tileWidth/2,2)+Math.pow(Map.tileHeight/2,2))/2
		var theta = (180-Util.radToDeg(Math.acos((Map.tileWidth*Map.tileWidth/4-2*a*a)/(2*a*a))))/2
		return theta
	},
	getDirection : function(x1,y1,x2,y2){
		var tile1 = Map.tileValue(x1,y1)
		var tile2 = Map.tileValue(x2,y2)
		i = tile1[0]; j = tile1[1]
		i2 = tile2[0]; j2 = tile2[1]
		var x = -1,y=-1;
		var rowEvenDirections = [[Map.N,i-2,j],[Map.S,i+2,j],[Map.E,i,j+1],[Map.W,i,j-1],[Map.NE,i-1,j],[Map.NW,i-1,j-1],[Map.SE,i+1,j],[Map.SW,i+1,j-1]]
		var rowOddDirections = [[Map.N,i-2,j],[Map.S,i+2,j],[Map.E,i,j+1],[Map.W,i,j-1],[Map.NE,i-1,j+1],[Map.NW,i-1,j],[Map.SE,i+1,j+1],[Map.SW,i+1,j]]
		if(i%2 == 0){
			for(var k=0;k<rowEvenDirections.length;k++){
				if(i2==rowEvenDirections[k][1]&&j2==rowEvenDirections[k][2]) return rowEvenDirections[k][0]
			}
		}else{
			for(var k=0;k<rowOddDirections.length;k++){
				if(i2==rowOddDirections[k][1]&&j2==rowOddDirections[k][2]) return rowOddDirections[k][0]
			}
		}
		return 0
	},
	getNeighbor : function(i,j,direction){
		var ret = null
		if(i%2==0) ret = Map.rowEvenDirections[direction]
		else ret = Map.rowOddDirections[direction]
		if(Map.grid[ret[0]+i]&&Map.grid[ret[0]+i][ret[1]+j]) return [ret[0]+i, ret[1]+j]
		return null
	},
	neighbors : function(node){
		var i=node.x
		var j=node.y
		var retList = []
		for (var k=0;k<8;k++){
			var neighbor = Map.getNeighbor(i,j,k)
			if(neighbor && (Map.grid[neighbor[0]][neighbor[1]].value ==0 || Map.grid[neighbor[0]][neighbor[1]].target)  &&Map.grid[neighbor[0]][neighbor[1]].terrainType==0 ) retList.push(Map.grid[neighbor[0]][neighbor[1]])
		}
		return retList
	},
	getAngleBetweenTiles : function(x1,y1,x2,y2){
		var tile1 = Map.tileValue(x1,y1)
		var tile2 = Map.tileValue(x2,y2)
		var dir = (x1%2==0)? -1 : 1
		var angle1 = Map.tileAngle
		var angle2 = 180 - Map.tileAngle
		var angle3 = 180 + Map.tileAngle
		var angle4 = 360 - Map.tileAngle
		var itr = []
		if(dir == 1) itr = [[-1,0,1],[1,0,3],[-1,dir,5],[1,dir,7],[-2,0,2],[2,0,6],[0,1,0],[0,-1,4]]
		else itr = [[-1,0,5],[1,0,7],[-1,dir,1],[1,dir,3],[-2,0,2],[2,0,6],[0,1,0],[0,-1,4]]
		for(var k=0;k< itr.length; k++){
				var l = tile1[0]+itr[k][0]
				var m = tile1[1]+itr[k][1]
				if(l==tile2[0]&&m==tile2[1]){
					return itr[k][2]
				}
		}
		return 0
	},
	
	//takes x,y values and map them to the map tiles
	tileValue : function(x,y){
		var halfX = Math.floor(x*2/Map.tileWidth)
		var halfY = Math.floor(y*2/Map.tileHeight)
		var halfW = Map.tileWidth/2
		var halfH = Map.tileHeight/2
		var up = false
		if(halfX%2==halfY%2){
			if(x-halfX*halfW+y-halfY*halfH < (halfX+1)*halfW-x+(halfY+1)*halfH-y){
				up = true
			}
		}else{
			if((halfX+1)*halfW-x+y-halfY*halfH <x-halfX*halfW +(halfY+1)*halfH-y){
				up = true
			}
		}
		var gridX=0
		var gridY=0
		if(halfX%2==0&&halfY%2==0&&!up ||halfX%2!=0&&halfY%2==0&&!up || halfX%2!=0&&halfY%2!=0 &&up || halfX%2==0&&halfY%2!=0 &&up)
		{
			//green area
			gridY = 2*Math.floor(halfY/2)+1
			gridX = Math.floor(halfX/2)
		}
		else{
			//brown area
			gridY = halfY + halfY%2
			gridX = Math.floor((halfX+1)/2)
		}
		return [gridY,gridX]
		
	},
	
	//takes tile values and map them to x,y values
	value : function(i,j){
		var y=Math.max(Math.round((i-1)*Map.tileHeight/2),0) 
		var	x=-((i+1)%2)*Map.tileWidth/2+j*Map.tileWidth+Map.tileWidth/2;
		return [x,y]
	},
	
	drawMap : function(){
		var img = new Image
		var img2 = new Image
		img.src="images/tile_dirt.png"
		img.onload = function(){
			img2.src="images/tile_grass.png"
			img2.onload = function(){
				//	Game.runGame()
			}
		}
		this.img = img
		this.img2 = img2
	},
	
	doDrawMap : function(){
		var origin = this.origin
		if(origin[0]>0)origin[0]--
		if(origin[1]>0)origin[1]--
		var end = Map.tileValue(Math.min(this.x+this.viewWidth,this.mapWidth),Math.min(this.y+this.viewHeight,this.mapHeight))
		for(i=0;10;i++){
			for(j=0;j<10;j++){
				var values = Map.value(i+origin[0],j+origin[1])
				var x=values[0]-this.x
				var y=values[1]-this.y
				if ((x<Map.viewWidth) && (y<Map.viewHeight) &&
					(x+Map.tileWidth>0) && (y+Map.tileHeight>0))
					{
						var img = null
						if(((origin[0]+i)%2 == 0)){
							img = this.img	
						}
						else{
							img = this.img2
						}
						img.style.position = "absolute"
						img.style.left = x +"px"
						img.style.top = y +"px"
						Map.div.appendChild(img.clone())
					}
			}
		}
		this.inViewObjects = []
		for(var k=0 ;k < this.objects.length ;k++){
			var obj=this.objects[k]
			if(obj.owner.x -this.x+Math.round(obj.imgWidth/2) >0 && obj.owner.x -this.x-Math.round(obj.imgWidth/2) < this.viewWidth 
			&& obj.y-this.y-Math.round(obj.imgHeight/2) < this.viewHeight && obj.y-this.y+Math.round(obj.imgHeight/2) >0)
			this.inViewObjects.pushInPlaceDescending(obj,'y')
		}

		var end = Map.tileValue(Math.min(this.x+this.viewWidth,this.mapWidth),Math.min(this.y+this.viewHeight,this.mapHeight))		
	},
	
	// gets the border tile for x,y values
	borderTileValues : function(x,y){
		var tileValues = Map.tileValue(x,y)
		return Map.value(tileValues[0],tileValues[1])		
	},

	addObjectToGrid : function(obj){
		var noOfRows = Math.ceil(obj.xdim/Map.tileIsoLength)
		var noOfColumns = Math.ceil(obj.ydim/Map.tileIsoLength)
		var topX = obj.owner.coords.x 
		var topY = obj.owner.coords.y -Map.tileHeight/2
		var originTile = Map.tileValue(topX,topY)
		var mapTiles = []
		for(var i=0;i<noOfRows+1;i++){
			if(!originTile) continue;
			originTile = Map.getNeighbor(originTile[0],originTile[1],Map.SW)
			if(!originTile) continue;
			var loopingTile = [];loopingTile[0] = originTile[0]; loopingTile[1] = originTile[1]
			for(var j=0;j<noOfColumns+1;j++){
				Map.grid[loopingTile[0]][loopingTile[1]].value = obj
				mapTiles.push(Map.grid[loopingTile[0]][loopingTile[1]])
				loopingTile = Map.getNeighbor(loopingTile[0],loopingTile[1],Map.SE)
			}
		}
		obj.mapTiles = mapTiles
	},
	
	addCreep : function(x,y){
		var creep = new Tank()
		creep.x = this.x+x
		creep.y = this.y+y
		Map.addElement(creep)
	},
	
	getRealCoords : function(x,y){
		return {"x":x+Map.x,"y":y+Map.y}
	},
	
	validateLocation : function(obj){
		var collide = false
		for(var i=0;i<this.objects.length;i++){
			if(obj.collides(this.objects[i])){
				collide = true
				break
			}			
		}
		return !collide
	},
	
	addElement : function(obj){
		var valid = this.validateLocation(obj)
		if(valid) {
	  	this.objects.push(obj)
	  	this.addObjectToGrid(obj)
	  }
		return valid
	},
	
	lookupLocation : function(x,y){
		var mapCoords = Map.tileValue(x,y)
		if(Map.grid[mapCoords[0]][mapCoords[1]].value)	return Map.grid[mapCoords[0]][mapCoords[1]].value.owner
		return null
	},
	clear :function(){
		if(this.objects)this.objects = []
		if(this.div)this.div.innerHTML = ""
	},
	occupied : function(x,y){
		var mapTiles = Map.tileValue(x,y)
		if(Map.grid[mapTiles[0]][mapTiles[1]].value)return true
		return false 
	},
	
	repeatMovement : function(xDirection,yDirection){
		var self = this;
		Map.periodicalMovementEvent = setInterval(function(){self.move(xDirection, yDirection)}, this.movementSpeed);
	},

	move : function (dx,dy){
		if(this.x+dx<0)
		{
			this.x=0;
		}
		else if (this.x+dx>this.mapWidth-this.viewWidth)
		{
			this.x = this.mapWidth - this.viewWidth
		}
		else
		{
			this.x+=dx;
			
		}
		if(this.y+dy<0)
		{
			this.y=0;
		}
		else if (this.y+dy>this.mapHeight-this.viewHeight)
		{
			this.y = this.mapHeight-this.viewHeight
		}
		else
		{
			this.y+=dy
		}
		this.div.style.left = -this.x +"px"
		this.div.style.top = -this.y +"px"
		this.origin = Map.tileValue(this.x,this.y)
		
		
	},
	
	stopMovement : function(){
		clearInterval(Map.periodicalMovementEvent);
	},
	
	hovered : function(x,y){
	},
	
	moveObject : function(object,x,y,callback,ignorePlace){
		var astar = new Astar()
		var srcTiles = Map.tileValue(object.coords.x,object.coords.y)
		var destTiles = Map.tileValue(x,y)
		Map.grid[destTiles[0]][destTiles[1]].target = true
	if(Map.grid[destTiles[0]][destTiles[1]].value!=0 && !ignorePlace) destTiles = Map.getNearestEmptyTile(destTiles)
		var path = astar.getOptimalPath(Map,Map.grid[srcTiles[0]][srcTiles[1]],Map.grid[destTiles[0]][destTiles[1]])
		for(var i=0;i<Math.ceil(this.mapHeight*2/this.tileHeight)+1;i++){
				for(var j=0;j<Math.ceil(this.mapWidth/this.tileWidth)+1;j++){
					this.grid[i][j].g=this.grid[i][j].h=this.grid[i][j].f=this.grid[i][j].visited=
					this.grid[i][j].closed = 0
					this.grid[i][j].parent = null
				}
			}
		Map.grid[destTiles[0]][destTiles[1]].target = false	
		if(path){
			object.moving = false;
			object.targetPoint = {x:x,y:y}
			object.movingPath = path;
			if(callback)object.movementFinishCallback = callback;
			return path 
		}
		
	},
	
	getNearestEmptyTile : function(tile){
		var openList = []
		openList.push(tile)
		var found = false
		while(!found){
			var tile = openList[0]
		 	for (var k=0;k<8;k++){
				var neighbor = Map.getNeighbor(tile[0],tile[1],k)
				if(neighbor && Map.grid[neighbor[0]][neighbor[1]].value ==0 &&Map.grid[neighbor[0]][neighbor[1]].terrainType==0 )return neighbor
				else if(neighbor) openList.push(neighbor)
			}
			openList.splice(0,1)			
		}	
	},
	
	registerListeners : function(div,owner){
		div.observe(game.mouseClickEvent,function(){
			if(!game.buildingMode.isOn && owner.working){
				owner.defaultAction();
			}
		})
		div.observe(game.mouseStartEvent,function(event){
			if (event.button != 2) {
			  	if (event.preventDefault) {
			  		event.preventDefault();
			  	}
	  		}
		})
    
    var mousemoveCallback = function(mouse){
      var x = mouse.pointerX() || mouse.touches[0].pageX;
      var y = mouse.pointerY() || mouse.touches[0].pageY;
      owner.sprites.mouseover.shiftX = x - ( owner.coords.x - Math.round(owner.imgWidth/2) - Map.x ) + 10;
      owner.sprites.mouseover.shiftY = y - ( owner.coords.y -Math.round(owner.imgHeight/2) - Map.y );
      owner.sprites.mouseover.render();
      owner.sprites.mouseover.show();
    }
    
    div.observe(game.mouseMoveEvent, mousemoveCallback);
    
		div.observe('mouseover',function(){
	  	if (owner.state != owner.states.NOT_PLACED) {
	  		if (owner.state != owner.states.UNDER_CONSTRUCTION)owner.sprites.outline.show();
  			if (owner.state == owner.states.NORMAL)owner.sprites.info.show();
	  		if(owner.sprites.text)owner.sprites.text.show()
        if(owner.state == owner.states.NORMAL && owner.sprites.moreContainer) 
          owner.sprites.moreContainer.show();
	  	}
		})
		div.observe('mouseout',function(){
			owner.sprites.outline.hide();
		    owner.sprites.mouseover.hide();
      		owner.sprites.info.hide();
			if(owner.sprites.text)owner.sprites.text.hide()
      if(owner.state == owner.states.NORMAL && owner.sprites.moreContainer) 
        owner.sprites.moreContainer.hide();
		})
	},

	registerSpecialListeners : function(div,owner, clickCall){
		div.observe(game.mouseClickEvent,function(){
			console.log('here')
			if(!game.buildingMode.isOn && owner.working){
				console.log('here')
				owner[clickCall]();
			}
		})
		div.observe(game.mouseStartEvent,function(event){
			if (event.button != 2) {
			  	if (event.preventDefault) {
			  		event.preventDefault();
			  	}
	  		}
		})
    
		div.observe('mouseover',function(){
	  	if (owner.state != owner.states.NOT_PLACED) {
	  		if (owner.state != owner.states.UNDER_CONSTRUCTION)owner.sprites.outline.show();
  			if (owner.state == owner.states.NORMAL)owner.sprites.info.show();
	  		if(owner.sprites.text)owner.sprites.text.show()
        if(owner.state == owner.states.NORMAL && owner.sprites.moreContainer) 
          owner.sprites.moreContainer.show();
	  	}
		})
		div.observe('mouseout',function(){
			owner.sprites.outline.hide();
		    owner.sprites.mouseover.hide();
      		owner.sprites.info.hide();
			if(owner.sprites.text)owner.sprites.text.hide()
      if(owner.state == owner.states.NORMAL && owner.sprites.moreContainer) 
        owner.sprites.moreContainer.hide();
		})
	},
//	checkBusyTiles : function(){
//		var canvas = document.createElement('canvas')
//		canvas.setAttribute('width',Map.mapWidth)
//		canvas.setAttribute('height',Map.map)
//	}
	E:0, NE:1, N:2, NW:3, W:4, SW:5, S:6, SE:7 
}

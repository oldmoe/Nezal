/*
	A sadly named module for layout generation
*/
var AI = {
	
	// initialize a map with null values
	initMap : function(mapX, mapY){
		var map = []
		for(var x=0; x< mapX; x++){
			var col = []
			for(var y = 0; y < mapY; y++){ col.push(null) }
			map.push(col);
		}
		return map
	},
	
	// given an array, extract consecutive spaces that are >= length
	// this is an O(n) operation
	findSpaces : function(array, length){
		var spaces = []
		var started = false;
		array.each(function(e, i){
			if(!started && e == null){
				started = true;
				spaces.push([i,1])
			}else if(started && e != null){ 
				started = false;
			}else if(started && e == null){ 
				spaces.last()[1]++ 
			}
		})
		return spaces.select(function(space){return space[1] > length})
	},
	
	// the real meat goes here, we determine the locations of the ships on the map using a simple algorithm
	// we first determine the ship orientation, either horizontal or vertical
	// if horizontal we extract all the map rows and put the indexes in an array
	// we select a row randomly, and scan it for empty spaces
	// if not enough empty space we delete the row's index and try another one
	// once enough space is found we randomly select a contigous chunk and label it with the ship's index
	// wash, rinse, repeat
	// @todo : this method will loop forever if there are not enough spaces to be found.
	// @todo : can we opt for a layoutin randomization strategy? may be
	layoutShips : function(ships){
		for(var i = 0; i < ships.length; i++){
			var orientation = Math.round(Math.random()) // 0 means horizontal, 1 means vertical
			var width = ships[i].width
			var rows = this.map.collect(function(e, i){ return i})
			var columns = this.map[0].collect(function(e, i){ return i}) 
			var done = false
			if(orientation == 0){ // horizontal
				// select one row randomly
				// if it does not have enough size delete it
				// if it does then insert the ship at a random location
				while(!done && rows.length > 0){
					var localIndex = Math.rand(rows.length)
					var rowIndex = rows[localIndex];
					var row = this.map.collect(function(col){ return col[rowIndex] })
					spaces = this.findSpaces(row, width)
					if(spaces.length > 0){
						// we found enough space, pick one randomly
						var space = spaces[Math.rand(spaces.length - 1)]
						// determine the start somewhere inside the found space
						var shipStart = space[0] + Math.rand(space[1] - width)
						// actually add the ship's data to the location
						for(var w = 0 ; w < width; w++){
							this.map[shipStart+w][rowIndex] = i
						}
						done = true
					}else{
						// not enough space in that row, remove and start over
						rows.splice(localIndex, 1)
					}	
				}
			}else{ // vertical
				while(!done && columns.length > 0){
					var localIndex = Math.rand(columns.length)
					var columnIndex = columns[localIndex];
					var column = this.map[columnIndex]
					spaces = this.findSpaces(column, width)
					if(spaces.length > 0){
						var space = spaces[Math.rand(spaces.length-1)]
						var shipStart = space[0] + Math.rand(space[1] - width)
						for(var w = 0 ; w < width; w++){
							this.map[columnIndex][shipStart+w] = i
						}
						done = true
					}else{
						columns.splice(localIndex, 1)
					}
				}				
			}
		}
	},
	
	init : function(mapX, mapY, ships){
		this.map = this.initMap(mapX, mapY);
		this.enemyMap = this.initMap(mapX, mapY);
		this.layoutShips(ships);
	}	
}

var s = {width:4}
var a = [s,s,s,s,s,s,s,s,s]
AI.init(16, 16, a)
for(var i = 0; i < AI.map.length; i++){
	console.log(AI.map[i].collect(function(e, i){return e == null ? 0 : e}))
}
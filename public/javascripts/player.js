var Player = {
  init : function( x, y ){
    console.log( "player initialized" )
    this.map = Map.clone(x, y);
    this.enemyMap = Map.clone(x, y);
    this.ships = [ Ship.clone( 2 ), Ship.clone( 2 ), Ship.clone( 2 ), Ship.clone( 3 ), Ship.clone( 3 ), Ship.clone( 4 ) ]
    //this.ships = [ Ship.clone( 2 ), Ship.clone( 1 ) ]
    this.hitPoints = this.ships.inject(0, function(total, ship){return total + ship.length});
    this.placeShips();
    this.map._draw();
    return this
  },
    
  play : function( ){
    console.log( "player played" )
    return this;
  },
  
  _play : function(x, y){
    console.log( "player played" )
    this.enemyMap[x][y] = this.game.fireAt(x, y);
    return this;
  },

  hitAt : function(x, y){
    console.log( "Player Got hit @ " + x + "," + y );
    if(this.map[x][y] != null){
      this.hitPoints--;
      console.log("hit, hit points now: " + this.hitPoints)
      return 1;
    }
    console.log("miss")
    return 0;
  }
  
}

var ComputerPlayer = Player.clone();

// given an array, extract consecutive spaces that are >= length
// this is an O(n) operation
Player.findSpaces = function(array, length){
//ComputerPlayer.findSpaces = function(array, length){
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
	return spaces.select(function(space){return space[1] >= length})
}

ComputerPlayer.play = function( ){
  console.log( "player played" )
  var done = false
  while(!done){
    var x = Math.rand(this.enemyMap.length - 1)
    var y = Math.rand(this.enemyMap[0].length - 1)
    if(this.enemyMap[x][y] == null){        
      this.enemyMap[x][y] = this.game.fireAt(x, y);
      done = true
    }
  }
  var me = this
  window.setTimeout(function(){me.game.turn()}, 100);
  return this;
}


// the real meat goes here, we determine the locations of the ships on the map using a simple algorithm
// we first determine the ship orientation, either horizontal or vertical
// if horizontal we extract all the map rows and put the indexes in an array
// we select a row randomly, and scan it for empty spaces
// if not enough empty space we delete the row's index and try another one
// once enough space is found we randomly select a contigous chunk and label it with the ship's index
// wash, rinse, repeat
// @todo : this method will loop forever if there are not enough spaces to be found.
// @todo : can we opt for a layoutin randomization strategy? may be

Player.placeShips = function(){

//ComputerPlayer.placeShips = function(){
	for(var i = 0; i < this.ships.length; i++){
		var orientation = Math.round(Math.random()) // 0 means horizontal, 1 means vertical
		var length = this.ships[i].length
		var rows = this.map.collect(function(e, i){ return i})
		var columns = this.map[0].collect(function(e, i){ return i}) 
		var done = false
		if(orientation == 0){ // horizontal
			// select one row randomly
			// if it does not have enough size delete it
			// if it does then insert the ship at a random location
			while(!done && rows.length > 0){
				var localIndex = Math.rand(rows.length-1)
				var rowIndex = rows[localIndex];
				var row = this.map.collect(function(col){ return col[rowIndex] })
				spaces = this.findSpaces(row, length)
				if(spaces.length > 0){
					// we found enough space, pick one randomly
					var space = spaces[Math.rand(spaces.length - 1)]
					// determine the start somewhere inside the found space
					var shipStart = space[0] + Math.rand(space[1] - length)
					// actually add the ship's data to the location
					for(var w = 0 ; w < length; w++){
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
				var localIndex = Math.rand(columns.length-1)
				var columnIndex = columns[localIndex];
				var column = this.map[columnIndex]
				spaces = this.findSpaces(column, length)
				if(spaces.length > 0){
					var space = spaces[Math.rand(spaces.length-1)]
					var shipStart = space[0] + Math.rand(space[1] - length);
					for(var w = 0 ; w < length; w++){
						this.map[columnIndex][shipStart+w] = i;
					}
					done = true;
				}else{
					columns.splice(localIndex, 1);
				}
			}				
		}
	}  
}

ComputerPlayer.init = function(){
  this.super().init.apply(this, arguments)
  console.log("computer player initialized")
  //this.placeShips();
  //this.map._draw();
  return this;
}

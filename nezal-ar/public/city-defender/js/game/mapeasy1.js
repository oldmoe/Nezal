var Map = {
	pitch : 32,
	width : 20,
	height: 15,
	grid : [],
	bgGrid : [
 [2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2],
[2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
[2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
[0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 0, 2, 2, 0, 0, 0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 0, 2, 2, 0, 0, 0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2]
	],
	entry : [[4,0],[5,0]],
	init : function(){
		for(var i = 0; i < this.width; i++){
			this.grid[i] = []
			for(var j = 0; j< this.height; j++){
				this.grid[i][j] = []
				this.grid[i][j].tower = null
				//bgctx.drawImage(this.tiles[this.bgGrid[i][j]], i*this.pitch, j*this.pitch)
			}
		}
		//bgctx.drawImage(bg, 0, 0)
	},
	value : function(x, y){
		return Map.bgGrid[Math.abs(Math.floor( x / Map.pitch))][Math.abs(Math.floor( y / Map.pitch))]
	},
	findTile : function(x, y){
		return [Math.abs(Math.floor(x/this.pitch)),Math.abs(Math.floor(y/this.pitch))]
	},
	transform : function(x){
		return Math.abs(Math.floor(x/this.pitch)*this.pitch)
	},
	empty : function(x, y){
		if(!this.grid[x]) return false;
		if(!this.grid[x][y]) return true;
		return this.grid[x][y].tower == null //&& this.grid[x][y].length == 0
	}
	
}

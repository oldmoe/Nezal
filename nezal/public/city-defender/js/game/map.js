			var bg = new Image();
			bg.src = 'images/city defender.png'

var Map = {
	pitch : 32,
	width : 20,
	height: 15,
	grid : [],
	tiles : [new Image(), new Image()],
	bgGrid : [
		[0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
		[0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
		[0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
		[0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
		[0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
		[0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
		[0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
		[0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
		[0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
		[0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	entry : [[0,1],[0,2]],
	init : function(bgctx){
		this.tiles[0].src = 'background/tiles/grass-texture (Custom).jpg'
		this.tiles[1].src = 'background/tiles/desert-texture (Custom).jpg'
		for(var i = 0; i < this.width; i++){
			this.grid[i] = []
			for(var j = 0; j< this.height; j++){
				this.grid[i][j] = []
				this.grid[i][j].tower = null
				bgctx.drawImage(this.tiles[this.bgGrid[i][j]], i*this.pitch, j*this.pitch)
			}
		}
		
	},
	value : function(x, y){
		return Map.bgGrid[Math.floor( x / Map.pitch)][Math.floor( y / Map.pitch)]
	},
	findTile : function(x, y){
		return [Math.floor(x/this.pitch),Math.floor(y/this.pitch)]
	},
	transform : function(x){
		return Math.floor(x/this.pitch)*this.pitch
	},
	empty : function(x, y){
		if(!this.grid[x]) return false;
		if(!this.grid[x][y]) return true;
		return this.grid[x][y].tower == null //&& this.grid[x][y].length == 0
	}
	
}
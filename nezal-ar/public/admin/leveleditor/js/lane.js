var Lane = Class.create({
	
	DEFAULT_TILE_COUNT : 10,
	
	parent : null,
	tiles : null,
	index: 0,
	domObject : null,
	self : null,
	
	initialize : function(parent){
		this.parent = parent;
		this.tiles = [];
		this.domObject = $(this.parent.domObject).insert({bottom:'<tr></tr>'}).lastChild;
		this.createOptionsTile();
		
		for(var i=0; i<this.DEFAULT_TILE_COUNT; i++){
			this.tiles.push(new Tile(this));
		}
	},

	getPosition: function(){
		return $(this.domObject).previousSiblings().size();
	},
	
	createOptionsTile: function(){
		var elem = $(this.domObject).insert({top:'<td style="background-color:white"><div class="deleteRowButton"></div></td>'}).firstChild.firstChild;
		var self = this;
		$(elem).observe('click', function(){
			var res = confirm("Are you sure you want to delete this lane?", "Confirmation");
			if(res == true){
				self.remove();
			}
		});
	},
	
	removeTile: function(index){
		$(this.tiles[index].domObject).remove();
		this.tiles.splice(index, 1);
		this.updateTilePositionsLabel();
	},

	addTile: function(index){
		this.tiles.splice(index+1,0,new Tile(this, this.tiles[index].domObject));
		this.updateTilePositionsLabel();		
	},
	
	remove: function(){
		this.parent.removeLane(this.getPosition());
	},
	
	updateTilePositionsLabel: function(){
		this.tiles.each(function(elem){
			elem.updatePositionLabel();
		});
	}
	
});
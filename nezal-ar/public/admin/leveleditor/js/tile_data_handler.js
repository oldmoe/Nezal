var TileDataHandler = new Class.create({
	
	levelEditor: null,
	containerId: 'tileDataDialog',
	tile: null,
	
	initialize: function(levelEditor){
		
		this.levelEditor = levelEditor;
		
		var self = this;
		$(this.containerId).select('input[class=delete]')[0].observe('click', function(){
			self.deleteObj();
		});

		$(this.containerId).select('div[class=dialogCloseButton]')[0].observe('click', function(){
			self.close();
		});
		
	},
	
	updateDialogData: function(){
		
		//update objects dropdwon list
		if($(this.containerId).select('select[id=objectsList]')[0])
			$(this.containerId).select('select[id=objectsList]')[0].replace("");
			
  		var select  = Element('select', {id:'objectsList'})
		$(this.containerId).select('input[class=delete]')[0].insert({'before':select});
		
		for(var k=0; k<this.tile.objects.length;k++){
			var obj = this.tile.objects[k];
	  		var a = new Element('option', {value:obj.name, index:k});
	  		a.update(obj.name+'('+Number(k+1)+')');
	  		select.appendChild(a);
		}
	},
	
	
	open: function(tile){
		this.tile = tile;
		this.updateDialogData();
		$(this.containerId).style.display = 'block';
	},
	
	deleteObj: function(){
		var index = $(this.containerId).select('select[id=objectsList]')[0].selectedIndex;
		this.updateObjectDependencies(index);
		this.tile.removeObject(index);
		this.updateDialogData();
		alert("Element has been deleted successfully");
	},
	
	updateObjectDependencies: function(index){
		var lanes = this.levelEditor.grid.lanes;
		for(var i=0; i<lanes.length; i++){
			for(var j=0; j<lanes[i].tiles.length; j++){
				var tile = lanes[i].tiles[j];
				for(var k=0; k<tile.messages.length;k++){
					if(tile.messages[k].tile.getPosition() == this.tile.getPosition() && tile.messages[k].object.index == index)
						tile.messages.splice(k,1);
				}
				if(this.tile.messages.length == 0)
					tile.unmark();
			}
		}
	},
	
	close: function(){
		$(this.containerId).style.display = 'none';
	}	
	
	
});

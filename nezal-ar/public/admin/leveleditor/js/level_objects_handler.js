var LevelObjectsHandler = new Class.create({
	
	levelEditor: null,
	containerId: 'levelObjectsContainer',
	domObject: null,
	tiles: null,
	multipleObjectsFalg : true,
	
	initialize: function(levelEditor){
		
		this.tiles = [];
		this.multipleObjectsFalg = true;
		
		this.levelEditor = levelEditor;
		this.domObject = $(this.containerId);
		
		this.addDropEvent();
		
		var self = this;
		$("levelObjects").select('input[class=random]')[0].observe('click', function(){
			self.distribute();
		});

		$("levelObjects").select('input[class=clearAll]')[0].observe('click', function(){
			self.removeAll();
		});
	},
	
	
	//not used right now because it is a subset from guided random
	spreadTotallyRandom: function(){
		var copies = Number($('objectsCopiesInput').value);
		var lanes = this.levelEditor.grid.lanes;
		var randomIndex = 0;
		var self = this;
		this.tiles.each(function(tile){
			for(var i=0; i<copies; i++){
				for(var j=0; j<lanes.length; j++){
					self.placeItemRandomly(lanes[j], tile, lanes[j].tiles.length, 0)
				}
			}
		});
	},
	
	distribute: function(){
		var lanes = this.levelEditor.grid.lanes;
		var self = this;
		this.tiles.each(function(tile){
			if(tile.settings && tile.settings.type == 1 && tile.settings.random){
				self.distributeRandomly(lanes, tile);
			}else if(tile.settings && tile.settings.type == 2 && tile.settings.cyclic){
				self.distributeCyclic(lanes, tile);
			} 
		});
	},
	
	distributeCyclic: function(lanes, tile){
		var freq = tile.settings.cyclic.freq;
		var end = tile.settings.cyclic.end;
			
		for(var j=0; j<lanes.length; j++){
			var interval = tile.settings.cyclic.interval;
			var i = tile.settings.cyclic.start;
			var stop = false;
			while(i<=end && !stop){
				
				for (var k=0; k < freq; k++) {
					lanes[j].tiles[i].addObject(tile.getDraggedImg(), true);
				}
				if((i+interval) > end){
					interval = end - i;
					stop = true;
				}
				i += interval;	
			}
		}
	},

	distributeRandomly: function(lanes, tile){
		this.multipleObjectsFalg = $("levelObjects").select('input[name=multipleObjects]')[0].checked;
		
		var freq = tile.settings.random.freq;
		var end = tile.settings.random.end;
			
		for(var j=0; j<lanes.length; j++){
			var interval = tile.settings.random.interval;
			var i = tile.settings.random.start;
			var stop = false;
			while(i<=end && !stop){
				for (var k=0; k < freq; k++) {
					this.placeItemRandomly(lanes[j], tile, interval, i)
				}
				if((i+interval) > end){
					interval = end - i;
					stop = true;
				}
				i += interval;	
			}
		}
	},

	placeItemRandomly: function(lane, sourceTile, interval, start){
		var randomIndex = 0;
		var flag = false;
		var tries = 0;
		while(!flag && tries < 10){
			randomIndex = Math.floor(interval * Math.random()) + start;
			if(lane.tiles[randomIndex] != null){
				var added  = lane.tiles[randomIndex].addObject(sourceTile.getDraggedImg(), this.multipleObjectsFalg);
				if(added)flag = true;
			}
			tries++;
		}
	},
	
	addDropEvent: function(){
		var self = this; 
		Droppables.add(this.domObject, {
			hoverclass : 'hoverActive',
			onDrop : function (draggable) {
				if(draggable.parentNode == self.domObject) return;
				if($(draggable).getAttribute('category') != 'background')
					self.addLOTile(draggable);
			}
		});
	},
	
	addLOTile: function(draggable){
		var tile = new LOTile(this, draggable);
		this.tiles.push(tile);
	},

	removeAll: function(){
		this.tiles = [];
		$('levelObjectsContainer').update("");
	},
	
	remove: function(index){
		$(this.tiles[index].domObject).remove();
		this.tiles.splice(index, 1);
	}
	
});

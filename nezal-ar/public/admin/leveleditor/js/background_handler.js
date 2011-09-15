var BackgroundHandler = Class.create({
	
	levelEditor: null,
	
	initialize: function(levelEditor){
		this.levelEditor = levelEditor;
		
		this.addDropEvent('bgLayer1');
		this.addDropEvent('bgLayer2');
		this.addDropEvent('day_night');
	},
	
	addDropEvent: function(dropTarget){
		var self = this; 
		Droppables.add($(dropTarget), {
			hoverclass : 'hoverActive',
			onDrop : function (draggable) {
				if($(draggable).getAttribute('category') == 'background')
					self.addCloseEvent($(dropTarget).insert({bottom:self.createHTMLElement(draggable)}).lastChild);
			}
		});
	},
	
	createHTMLElement: function(draggable){
		return '<div style="float:left;position: relative">'+
		'<div class="loCloseIcon"></div>'+
		this.createDraggedItem(draggable)+
		'</div>';
	},
	
	addCloseEvent: function(tile){
		var self = this; 
		tile.select('[class=loCloseIcon]')[0].observe('click', function(){
			var res = confirm("Are you sure you want to delete this tile?", "Confirmation");
			if(res == true){
				self.remove(tile);
			}
		});	
	},
		
	createDraggedItem : function (draggable){
		return '<img src="'+draggable.src+'" name="'+draggable.name+'" category="'+$(draggable).getAttribute('category')+'" />';
	},
	
	remove: function(tile){
		tile.remove();
	},
	
	getLayer1Data: function(){
		return this._exportData('bgLayer1');
	},

	getLayer2Data: function(){
		return this._exportData('bgLayer2');
	},

	getDayNightData: function(){
		return this._exportData('day_night');
	},
	
	_exportData: function(container){
		var data = [];
		$(container).childElements().each(function(elem){
			var obj = {};
			obj.name = $(elem.lastChild).getAttribute('name');
			data.push(obj);
		});
		return data;
	}
	
	
});
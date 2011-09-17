var BackgroundHandler = Class.create({
	
	levelEditor: null,
	
	initialize: function(levelEditor){
		this.levelEditor = levelEditor;
		
		this.addDropEvent('bgLayer1');
		this.addDropEvent('bgLayer2');
		this.addDropEvent('landmarks');
		
		this.layer1 = $("");
	},
	
	addDropEvent: function(dropTarget){
		var self = this; 
		Droppables.add($(dropTarget), {
			hoverclass : 'hoverActive',
			onDrop : function (draggable) {
				if($(draggable).getAttribute('category') == 'background')
					self.addObject(draggable, dropTarget);
			}
		});
	},
	
	loadObject: function(obj, container){
	  this.createObject(obj, $(container)); 
	},
	
	addObject: function(draggable, dropTarget){
    var obj = {};
    obj.name = draggable.name;
    obj.category = $(draggable).getAttribute('category');
    obj.image = draggable.src;
	  this.createObject(obj, dropTarget);
	},
	
	createObject: function(obj, container){
	  this.addCloseEvent($(container).insert({bottom:this.createHTMLElement(obj)}).lastChild);
	},
	
	createHTMLElement: function(obj){
		return '<div style="float:left;position: relative">'+
		'<div class="loCloseIcon"></div>'+
		this.createDraggedItem(obj)+
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
		
	createDraggedItem : function (obj){
		return '<img src="'+obj.image+'" name="'+obj.name+'" category="'+obj.category+'" />';
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

	getLandMarks: function(){
		return this._exportData('landmarks');
	},
	
  loadData: function(data){
    
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
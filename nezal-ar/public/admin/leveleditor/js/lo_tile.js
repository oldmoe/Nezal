var LOTile = Class.create({
	
	domObject : null,
	parent : null,
	settings: null,
	
	initialize: function(parent, draggable){
		this.parent = parent;
		this.settings = {};
		this.domObject = $(this.parent.domObject).insert({bottom:this.createHTMLElement(draggable)}).lastChild;
		
		var self = this

		this.domObject.select('[class=loSettingsIcon]')[0].observe('click', function(){
			self.openContent();
		});	
		
		this.domObject.select('[class=loCloseIcon]')[0].observe('click', function(){
			var res = confirm("Are you sure you want to delete this tile?", "Confirmation");
			if(res == true){
				self.remove();
			}
		});	
				
		new Draggable(this.domObject, {revert : true});
	},

	getPosition: function(){
		return $(this.domObject).previousSiblings().size();
	},
	
	createHTMLElement: function(draggable){
		return '<div style="float:left">'+
		this.createDraggedItem(draggable)+
    '<div class="loCloseIcon"></div>'+
    '<div class="loSettingsIcon"></div>'+
		'</div>';
	},
	
	createDraggedItem : function (draggable){
		return '<img id="draggedImg" src="'+draggable.src+'" name="'+draggable.name+'" category="'+$(draggable).getAttribute('category')+'" type="'+$(draggable).getAttribute('type')+'" />';
	},
	
	getDraggedImg: function(){
		return $(this.domObject).select('img[id=draggedImg]')[0];
	},
	
	openContent: function(){
		this.parent.levelEditor.loSettingsHandler.open(this);
	},
	
	remove: function(){
		this.parent.remove(this.getPosition());
	}
		
});
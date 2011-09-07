var Tile = Class.create({
	
	domObject : null,
	parent : null,
	x : 0,
	objects : null,
	messages: null,
	
	initialize: function(parent, prevObj){
		this.parent = parent;
		
		this.objects = [];
		this.messages = [];
		
		if(prevObj){
			this.domObject = $(prevObj).insert({after:this.createHTMLElement()}).next();
		}else
			this.domObject = $(this.parent.domObject).insert({bottom:this.createHTMLElement()}).lastChild;
		
		this.updatePositionLabel();		
		
		var self = this;
		this.domObject.observe('mouseover', function(){
			self.domObject.select('div[id=options]')[0].style.display = 'block';
		});				
		this.domObject.observe('mouseout', function(){
			self.domObject.select('div[id=options]')[0].style.display = 'block';
		});	
		
		this.domObject.select('[id=addButton]')[0].observe('click', function(){
			self.addTile();
		});	

		this.domObject.select('[id=discussionButton]')[0].observe('click', function(){
			self.openDiscussion();
		});	

		this.domObject.select('[id=editButton]')[0].observe('click', function(){
			self.openContent();
		});	

		this.domObject.select('[id=deleteButton]')[0].observe('click', function(){
			var res = confirm("Are you sure you want to delete this tile?", "Confirmation");
			if(res == true){
				self.remove();
			}
		});	
		
		this.addDropEvent();
	},
	
	getPosition: function(){
		return $(this.domObject).previousSiblings().size()-1;
	},
	
	updatePositionLabel: function(){
		this.domObject.select('[id=index]')[0].update(Number(this.getPosition()+1)+"");
	},
	
	addDropEvent: function(){
		var self = this;
		Droppables.add(self.domObject, {
			hoverclass : 'hoverActive',
			onDrop : function (draggable) {
				if($(draggable).getAttribute('category') != 'background'){
					self.addObject(draggable, true);
				}
			}
		});
	},
	
	addObject: function(item, multiple){
		var obj = {};
		obj.name = $(item).getAttribute('name');
		obj.category = $(item).getAttribute('category');

		if(!multiple){
			for(var i=0; i<this.objects.length; i++){
				if(this.objects[i].name == obj.name && this.objects[i].category == obj.category){
					return false;
				} 
			}
		}

		this.objects.push(obj);
		obj.index = this.objects.length -1 ;
		 
		this.domObject.select('div[id=content]')[0].insert({bottom:this.createDraggedItem(item)});
		return true;
	},
	
	removeObject: function(index){
		this.objects.splice(index, 1);
		this.objects.each(function(obj){
			if(obj.index > index)
				obj.index--;
		});
		this.domObject.select('div[id=content]')[0].childElements()[index].remove();
	},
	
	createHTMLElement: function (){
		return '<td class="dropbox" valign="top">' +
		'<div id="content" style="width:75px;height:92px;overflow:auto"></div>'+ 
			'<div id="options" style="display:block;width:64px">'+
				'<img id="addButton" src="images/add_icon.png" class="tileIcon" />'+
				'<img id="deleteButton" src="images/delete_icon.png" class="tileIcon" />'+
				'<img id="discussionButton" src="images/discussion_icon.png" class="tileIcon" />'+
				'<img id="editButton" src="images/edit_icon.png" class="tileIcon" />'+
			'</div>'+
			'<div id="index" style="float:left;width:100%"></div></td>';
	},
	
	createDraggedItem : function (draggable){
		return '<img src="'+draggable.src+'" name="'+draggable.name+'" category="'+$(draggable).getAttribute('category')+'" style="width:30px;float:left"/>';
	},
	
	openContent: function(){
		this.parent.parent.levelEditor.tileDataHandler.open(this)
	},
	
	addTile: function(){
		this.parent.addTile(this.getPosition());
	},
	
	openDiscussion: function(){
		this.parent.parent.levelEditor.message.open(this)
	},
	
	remove: function(){
		this.parent.removeTile(this.getPosition());
	},
	
	mark: function(){
		this.domObject.style.border = '2px solid red';
	},
	
	unmark: function(){
		this.domObject.style.border = '1px solid gray';
	}
});
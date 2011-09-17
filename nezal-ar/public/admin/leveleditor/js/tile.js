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
	  if(item.innerHTML != ""){//incase of dragging objecdts from level objects.
	    item = item.firstChild;
	  }
	  
	  var obj = {};
    obj.image = item.src;
    obj.name = $(item).getAttribute('name');
    obj.category = $(item).getAttribute('category');
		var type = $(item).getAttribute('type');
    
    this.loadType(obj, type);
    
    var count = 1;
    if(obj.category == 'enemy')
      count = obj.type.clos * obj.type.rows;
    
    if(!this.parent.parent.valid(count, this.getPosition(), this.parent.getPosition())){
      return;
    }
    
    this.createObject(obj, multiple);
	},

  loadType: function(obj, type){
    if(type){
      if(obj.category == "enemy"){
        obj.type = {cols:type.split("_")[0], rows:type.split("_")[1]};
      }else if(obj.category == "powrups"){
        obj.type = type;
      }
    }
  },
  	
  loadObject: function(obj){
    this.loadType(obj, obj.type);
    this.createObject(obj, true);
  },
	
	createObject: function(obj, multiple){
    if(!multiple){
      for(var i=0; i<this.objects.length; i++){
        if(this.objects[i].name == obj.name && this.objects[i].category == obj.category){
          return false;
        } 
      }
    }

    this.objects.push(obj);
    obj.index = this.objects.length -1 ;
     
    this.domObject.select('div[id=content]')[0].insert({bottom:this.createDraggedItem(obj)});
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
	
	createDraggedItem : function (obj){
		return '<img src="'+obj.image+'" name="'+obj.name+'" category="'+obj.category+'" style="width:30px;float:left"/>';
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
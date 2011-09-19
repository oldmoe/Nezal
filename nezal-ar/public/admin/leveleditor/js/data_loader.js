var DataLoader = Class.create({

	CAT_ENEMY: 'enemy',
	CAT_CROW_MEMBER: 'crowd',
	CAT_PROTECTION_REBUILD: 'protection',
	CAT_OBJECTS: 'objects',
	CAT_POWERUPS: 'powerup',
	CAT_BACKGROUND: 'background',
	
	data : null,
	
	initialize: function(){
		this.initData();
		this.load();
		// this.addDraggableEvent();
	},
	
	initData: function(){
	  this.data = EditorData;
	},
	
	load: function(){
		var self = this;
		this.data.each(function(obj){
			switch(obj.category){
				case self.CAT_ENEMY:
					$('enemiesContainer').appendChild(new Element('img', {'class':'draggablesImg', src: obj.src, name:obj.name, category:obj.category, type:obj.type}));
				  break;
				case self.CAT_PROTECTION_REBUILD:
				  break;
				case self.CAT_CROW_MEMBER:
					$('crowdMemberContainer').appendChild(new Element('img', {"class":'draggablesImg', src: obj.src, name:obj.name, category:obj.category}));
				  break;
				case self.CAT_OBJECTS:
				  break;
				case self.CAT_POWERUPS:
				  $('powerupsContainer').appendChild(new Element('img', {"class":'draggablesImg', src: obj.src, name:obj.name, category:obj.category}));
				  break;
				case self.CAT_BACKGROUND:
					$('backgroundContainer').appendChild(new Element('img', {"class":'draggablesImg', src: obj.src, name:obj.name, category:obj.category}));
				  break;
			}			
		});
	},
	
	addDraggableEvent: function(){
		$$('.draggables').each(function(elem){
			$(elem).childElements().each(function(item) {
				new Draggable(item, {revert : true});
			});
		});	
	}
	
	
});

var DataLoader = Class.create({

	CAT_ENEMY: 'enemy',
	CAT_CROW_MEMBER: 'crowd',
	CAT_PROTECTION_REBUILD: 'protection',
	CAT_OBJECTS: 'objects',
	CAT_ITEMS: 'items',
	CAT_BACKGROUND: 'background',
	
	data : null,
	
	
	initialize: function(){
		this.initData();
		this.load();
		this.addDraggableEvent();
	},
	
	initData: function(){
		this.data = [
			{src:'images/objects/amn_markazy.png',name:'amn_markazy.png', category:'enemy'}, 
			{src:'images/objects/dehydrator.png', name:'dehydrator.png', category:'crowd'}, 
			{src:'images/objects/healer.png', name:'healer.png', category:'crowd'},
			{src:'images/objects/salafi.png', name:'salafi.png', category:'crowd'}, 
			{src:'images/objects/ultras.png', name:'ultras.png', category:'crowd'},
			//backgrounds
			{src:'images/backgrounds/3amod.png', name:'3amod.png', category:'background'},
			{src:'images/backgrounds/land.png', name:'land.png', category:'background'},
			{src:'images/backgrounds/sky1.png', name:'sky1.png', category:'background'},
			{src:'images/backgrounds/sky2.png', name:'sky2.png', category:'background'},
			{src:'images/backgrounds/sky3.png', name:'sky3.png', category:'background'},
			{src:'images/backgrounds/skyline.png', name:'skyline.png', category:'background'},
			{src:'images/backgrounds/street_marks.png', name:'street_marks.png', category:'background'} 
		];
	},
	
	load: function(){
		var self = this;
		this.data.each(function(obj){
			switch(obj.category){
				case self.CAT_ENEMY:
					$('enemiesContainer').appendChild(new Element('img', {'class':'draggablesImg', src: obj.src, name:obj.name, category:obj.category}));
				  break;
				case self.CAT_PROTECTION_REBUILD:
				  break;
				case self.CAT_CROW_MEMBER:
					$('crowdMemberContainer').appendChild(new Element('img', {"class":'draggablesImg', src: obj.src, name:obj.name, category:obj.category}));
				  break;
				case self.CAT_OBJECTS:
				  break;
				case self.CAT_ITEMS:
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

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
			{src:'images/objects/amn_markazy.png', name:'wood_stick_cs', category:'enemy', type: "1_1"},
			{src:'images/objects/amn_markazy.png', name:'wood_stick_cs', category:'enemy', type: "1_2"},
			{src:'images/objects/amn_markazy.png', name:'wood_stick_cs', category:'enemy', type: "1_3"},
			{src:'images/objects/amn_markazy.png', name:'wood_stick_cs', category:'enemy', type: "2_3"},
			{src:'images/objects/amn_markazy.png', name:'wood_stick_cs', category:'enemy', type: "3_3"},
			{src:'images/objects/amn_markazy_car.png', name:'amn_markazy_car', category:'enemy'}, 
			{src:'images/objects/box_car.png', name:'box_car', category:'enemy'},
			
			{src:'images/objects/normal_man.png', name:'normal_man', category:'crowd'},
			{src:'images/objects/micman.png', name:'micman', category:'crowd'},
			{src:'images/objects/journalist.png', name:'journalist', category:'crowd'},
			{src:'images/objects/girl.png', name:'girl', category:'crowd'},
			{src:'images/objects/girl_7egab.png', name:'girl_7egab', category:'crowd'},
			{src:'images/objects/doctor.png', name:'doctor', category:'crowd'},
			{src:'images/objects/bottleguy.png', name:'bottleguy', category:'crowd'},
			{src:'images/objects/7alaman.png', name:'7alaman', category:'crowd'},
			{src:'images/objects/dehydrator.png', name:'dehydrator', category:'crowd'},
			{src:'images/objects/ambulance.png', name:'ambulance', category:'crowd'}, 
			{src:'images/objects/healer.png', name:'healer', category:'crowd'},
			{src:'images/objects/salafi.png', name:'salafi', category:'crowd'}, 
			{src:'images/objects/ultras.png', name:'ultras', category:'crowd'},
			//backgrounds
			{src:'images/backgrounds/3amod.png', name:'3amod', category:'background'},
			{src:'images/backgrounds/land.png', name:'land', category:'background'},
			{src:'images/backgrounds/sky1.png', name:'sky1', category:'background'},
			{src:'images/backgrounds/sky2.png', name:'sky2', category:'background'},
			{src:'images/backgrounds/sky3.png', name:'sky3', category:'background'},
			{src:'images/backgrounds/skyline.png', name:'skyline', category:'background'},
			{src:'images/backgrounds/street_marks.png', name:'street_marks', category:'background'} 
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

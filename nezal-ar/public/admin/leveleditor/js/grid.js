var Grid = Class.create({
	
	lanes: null,
	domObject : null,
	gridContainer : 'targetContainer',
	levelEditor: null,
	
	initialize: function(levelEditor){
		this.levelEditor = levelEditor;
		this.lanes =  [];	
		this.domObject = $(this.gridContainer);
		
		this.addLane();
		
		self = this;
		$('controls').select('[class=addRowButton]')[0].observe('click', function(){
			self.addLane();
		});
		
	},
	
	addLane : function(){
		if(this.lanes.length > 2){
			alert("You can't add more lanes. Max numbre of lanes is 3.");
			return;
		}
			
		this.lanes.push(new Lane(this));
	},
	
	getMaxLaneLength: function(){
		var max = this.lanes[0].length;
		for (var i=1; i < this.lanes.length; i++) {
			if(this.lanes[i].length > max)
				max = this.lanes[i].length;
		}
		return max;
	},
	
	removeLane: function(index){
		$(this.lanes[index].domObject).remove();
		this.lanes.splice(index, 1);
	}
});

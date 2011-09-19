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
		this.addLane();
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
	
	adjustLength: function(length){
	  for (var i=0; i < this.lanes.length; i++) {
	    for (var j=this.lanes[i].tiles.length; j < length; j++) {
	      this.lanes[i].addTile(j-1);
			};
		};
	},
	
	valid: function(newCount, tileIndex, laneIndex){
    if((newCount+this.getObjectsCount(this.lanes[laneIndex].tiles[tileIndex].objects)) > 27){
      alert("You can't add this item in this tile. This tile reached the maximum number of allowed objects. Items can be added in this thile but in other lanes.");
      return false;
    }
      
    var totalCount = 0;
    for (var i=0; i < this.lanes.length; i++) {
      if(laneIndex != i && this.lanes[i].tiles[tileIndex])
          totalCount += this.getObjectsCount(this.lanes[i].tiles[tileIndex].objects);
    }
    
    if((newCount+totalCount) > 27){
      alert("You can't add this item in this tile. This tile reached the maximum number of allowed objects.");
      return false;
    }
    
    return true;
	},
	
  getObjectsCount: function(objects){
    var totalCount = 0;
    for (var i=0; objects && i < objects.length; i++) {
      if(objects[i].category == "enemy")
        totalCount += objects[i].type.cols * objects[i].type.rows;
    }  
    return totalCount;
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

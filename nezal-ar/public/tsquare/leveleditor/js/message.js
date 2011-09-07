var Message = Class.create({
	
	tile : null,
	containerId: 'discussionDialog',
	levelEditor: null,
	
	initialize: function(levelEditor){
		this.levelEditor = levelEditor;

		var self = this
		
		$(this.containerId).select('input[class=add]')[0].observe('click', function(){
			self.add();
		});

		$(this.containerId).select('input[class=reset]')[0].observe('click', function(){
			self.reset();
		});

		$(this.containerId).select('div[class=dialogCloseButton]')[0].observe('click', function(){
			self.close();
		});

	},

	open: function(tile){
		this.tile = tile;
		this.updateDialogData();
		$('discussionDialog').style.display = 'block';
	},

	close: function(){
		$('discussionDialog').style.display = 'none';
	},
	
	add: function(){
		
		var select = $(this.containerId).select('select[id=gameElementsList]')[0];
		
		var option = select.options[select.selectedIndex];
		
		var obj = {};
		obj.message = $(this.containerId).select('textarea[class=messageText]')[0].value.strip();
		obj.tile = this.levelEditor.grid.lanes[option.getAttribute('lane')].tiles[option.getAttribute('x')];
		//this is the order of the object inside the tile
		obj.object = obj.tile.objects[option.getAttribute('index')];
		
		this.tile.messages.push(obj);
		
		$(this.containerId).select('textarea[class=messageText]')[0].value = '';
		this.updateMessagesList();
	},

	reset: function(){
		this.tile.messages = [];
		this.updateMessagesList();
	},
	
	updateDialogData: function(){
		
		//update objects dropdwon list
		if($(this.containerId).select('select[id=gameElementsList]')[0])
			$(this.containerId).select('select[id=gameElementsList]')[0].replace("");
			
  		var select  = Element('select', {id:'gameElementsList'})
		$('discussionMessage').insert({'before':select});
		
		var lanes = this.levelEditor.grid.lanes;
		for(var i=0; i<lanes.length; i++){
			for(var j=0; j<lanes[i].tiles.length; j++){
				var tile = lanes[i].tiles[j];
				for(var k=0; k<tile.objects.length;k++){
					var obj = tile.objects[k];
					var x = tile.getPosition();
					var lane = lanes[i].getPosition();
			  		var a = new Element('option', {value:obj.name, x:x, lane:lane, index:k});
			  		a.update(obj.name+'('+Number(lane+1)+','+Number(x+1)+','+Number(k+1)+')');
			  		select.appendChild(a);
				}
			}
		}
		
		//update existing list
		this.updateMessagesList();
	},
	
	updateMessagesList: function(){
		var messagesList = $(this.containerId).select('ol[id=messagesList]')[0];
		messagesList.update("");
		for(var i=0; i<this.tile.messages.length; i++){
			var obj = this.tile.messages[i];
			var a = new Element('li');
			messagesList.appendChild(a);
			a.update(obj.tile.objects[obj.object.index].name + "(" + Number(obj.tile.parent.getPosition()+1) + "," + Number(obj.tile.getPosition()+1) +"," +Number(obj.object.index+1)+ "): " + obj.message);
		}
		
		if(this.tile.messages.length){
			this.tile.mark();
		}else{
			this.tile.unmark();
		}
	}

});

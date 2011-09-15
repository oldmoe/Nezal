var DataExporter = Class.create({
	
	levelEditor: null,
	containerId: 'exportDialog',
	
	initialize: function(levelEditor){
		this.levelEditor = levelEditor;
		
		var self = this;

		$(this.containerId).select('div[class=dialogCloseButton]')[0].observe('click', function(){
			$(self.containerId).style.display = 'none';
		});

		$('controls').select('[class=exportButton]')[0].observe('click', function(){
			self.displayData();
		});
	},

	
	exportData: function (){
		var data = [];
		var x = 0;
		var l = 0;
		var elementIndex = 0;
		
		var lanesData = this.levelEditor.grid.lanes;
		
		for(var i=0; i<lanesData.length; i++){
			for(var j=0; j<lanesData[i].tiles.length; j++){
				for (var k=0; k < lanesData[i].tiles[j].objects.length; k++) {
					var obj = lanesData[i].tiles[j].objects[k];
					obj.lane = i;
					obj.x = j;
					obj.order = elementIndex++;
				}
			}
			elementIndex = 0;
		}

		for(var i=0; i<lanesData.length; i++){
			if(data[l] == null) data[l] = [];
			for(var j=0; j<lanesData[i].tiles.length; j++){
				for (var k=0; k < lanesData[i].tiles[j].objects.length; k++) {
				  var obj = Object.clone(lanesData[i].tiles[j].objects[k]);
				  if(obj.category == "enemy")
				    obj.type = obj.type.cols + "_" + obj.type.rows;
				  delete obj.image;
				  
					data[l][x++] = obj
				}
				if(lanesData[i].tiles[j].messages.length > 0){
					var obj = {};
					obj.x = j;
					obj.name = "scenario";
					obj.scenario = [];
					
					lanesData[i].tiles[j].messages.each(function(elem){
						var message = {};
						message.order = lanesData[elem.tile.parent.getPosition()].tiles[elem.tile.getPosition()].objects[elem.object.index].order;
						message.msg = elem.message;
						message.lane = elem.lane;
						obj.scenario.push(message);
					});
					data[l][x++] = obj;
				}
			}
			x=0;
			l++;
		}
		
		var gameData = {};
		gameData.data = data;
		gameData.backgrounds = [this.levelEditor.backgroundHandler.getLayer1Data(), this.levelEditor.backgroundHandler.getLayer2Data(), this.levelEditor.backgroundHandler.getDayNightData()];
		var settings = this.levelEditor.settingsHandler.getData();
		gameData.energy = settings.energy;
		gameData.environment = settings.environment;
		gameData.gameModes = settings.gameModes;
		
		return gameData;
	},

  displayData : function(){
    var gameData = this.exportData();
		$(this.containerId).select('[id=dataMessage]')[0].value = Object.toJSON(gameData);
		$(this.containerId).style.display = 'block';
  }	
	
	
});

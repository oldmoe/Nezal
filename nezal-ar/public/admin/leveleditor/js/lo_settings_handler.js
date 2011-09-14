var LOSettingsHandler = new Class.create({
	
	levelEditor: null,
	settings: null,
	containerId: 'loSettingsDialog',
	tile: null,
		
	initialize: function(levelEditor){
		
		this.levelEditor = levelEditor;
		this.settings = {};
		
		var self  = this;
		$(this.containerId).select('div[class=dialogCloseButton]')[0].observe('click', function(){
			self.close();
		});

		$(this.containerId).select('input[class=save]')[0].observe('click', function(){
			self.save();
		});
		
	},

	save: function(){
		if($(this.containerId).select('input[id=type1]')[0].checked){
			this.tile.settings.type = 1;
			this.tile.settings.random = {};
			this.tile.settings.random.start = Number($(this.containerId).select('input[name=start]')[0].value) - 1;
			this.tile.settings.random.end = Number($(this.containerId).select('input[name=end]')[0].value) - 1;
			this.tile.settings.random.freq = Number($(this.containerId).select('input[name=freq]')[0].value);
			this.tile.settings.random.interval = Number($(this.containerId).select('input[name=interval]')[0].value);
			if(this.tile.settings.random.end < 0){
				this.tile.settings.random.end = Number(this.levelEditor.grid.getMaxLaneLength());
			}
			
		}else if($(this.containerId).select('input[id=type2]')[0].checked){
			this.tile.settings.type = 2;
			this.tile.settings.cyclic = {};
			this.tile.settings.cyclic.start = Number($(this.containerId).select('input[name=start2]')[0].value) - 1;
			this.tile.settings.cyclic.end = Number($(this.containerId).select('input[name=end2]')[0].value) - 1;
			this.tile.settings.cyclic.freq = Number($(this.containerId).select('input[name=freq2]')[0].value);
			this.tile.settings.cyclic.interval = Number($(this.containerId).select('input[name=interval2]')[0].value);
			if(this.tile.settings.cyclic.end < 0){
				this.tile.settings.cyclic.end = Number(this.levelEditor.grid.getMaxLaneLength());
			}
		}
		
		this.close();
	},
	
	getData: function(){
		return this.settings;
	},
	
	open: function(tile){
		this.tile = tile;
		this.upateDate();
		$('loSettingsDialog').style.display = 'block';
	},
	
	upateDate: function(){
		$(this.containerId).select('input[id=type1]')[0].checked = "checked";
		
		$(this.containerId).select('input[name=start]')[0].value = 0;
		$(this.containerId).select('input[name=end]')[0].value = 0;
		$(this.containerId).select('input[name=freq]')[0].value = 0;
		$(this.containerId).select('input[name=interval]')[0].value = 0;

		$(this.containerId).select('input[name=start2]')[0].value = 0;
		$(this.containerId).select('input[name=end2]')[0].value = 0;
		$(this.containerId).select('input[name=freq2]')[0].value = 0;
		$(this.containerId).select('input[name=interval2]')[0].value = 0;

		if(this.tile.settings.type == 1 && this.tile.settings.random){
			$(this.containerId).select('input[id=type1]')[0].checked = "checked";
			$(this.containerId).select('input[name=start]')[0].value = Number(this.tile.settings.random.start) + 1;
			$(this.containerId).select('input[name=end]')[0].value = Number(this.tile.settings.random.end) + 1;
			$(this.containerId).select('input[name=freq]')[0].value = this.tile.settings.random.freq;
			$(this.containerId).select('input[name=interval]')[0].value = this.tile.settings.random.interval;

		}else if(this.tile.settings.type == 2 && this.tile.settings.cyclic){
			$(this.containerId).select('input[id=type2]')[0].checked = "checked";
			$(this.containerId).select('input[name=start2]')[0].value = Number(this.tile.settings.cyclic.start) + 1;
			$(this.containerId).select('input[name=end2]')[0].value = Number(this.tile.settings.cyclic.end) + 1;
			$(this.containerId).select('input[name=freq2]')[0].value = this.tile.settings.cyclic.freq;
			$(this.containerId).select('input[name=interval2]')[0].value = this.tile.settings.cyclic.interval;

		}
	},
	
	close: function(){
		this.tile = null;
		$('loSettingsDialog').style.display = 'none';
	}
	
});

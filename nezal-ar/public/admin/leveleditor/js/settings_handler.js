var SettingsHandler = new Class.create({
	
	levelEditor: null,
	settings: {},
	containerId: 'settingsDialog',
	energyContainerId: 'energySettingsContainer',
		
	initialize: function(levelEditor){
		this.levelEditor = levelEditor;
		this.settings.environment = "day";
		this.settings.gameModes = ['normal'];
		
		var self  = this;
		$('controls').select('[class=settingsButton]')[0].observe('click', function(){
			self.open();
		});
		$(this.containerId).select('div[class=dialogCloseButton]')[0].observe('click', function(){
			self.close();
		});

		$(this.energyContainerId).select('input[class=add]')[0].observe('click', function(){
			self.addEnergyMessage();
		});

		$(this.energyContainerId).select('input[class=delete]')[0].observe('click', function(){
			self.deleteEnergyMessage();
		});
		
		$(this.containerId).select('input[name=environment]').each(function(elem){
			elem.observe('click', function(event){
				self.settings.environment = event.target.value;
			});		
		});

		$(this.containerId).select('input[name=gameModes]').each(function(elem){
			elem.observe('change', function(event){
				if(event.target.checked){
					if(self.settings.gameModes.indexOf(event.target.value) < 0)
						self.settings.gameModes.push(event.target.value);
				}else{
					if(self.settings.gameModes.indexOf(event.target.value) > -1)
						self.settings.gameModes.splice(self.settings.gameModes.indexOf(event.target.value), 1);
				}
			});		
		});
		
	},
	
	addEnergyMessage: function(){
	  	var obj = {};
	  	obj.energy = $('energyValue').value;
	  	obj.message = $('energyMessage').value;
	  	
		if(!this.settings.energy)this.settings.energy = [];
		
		this.settings.energy.push(obj); 
		
		$('energyValue').value = '';
		$('energyMessage').value = '';
		
		this.updateEnergyMessagesList();
	},

	deleteEnergyMessage: function(){
		this.settings.energy.splice($('energyMessages').selectedIndex, 1);
		this.updateEnergyMessagesList();
	},
	
	updateEnergyMessagesList: function(){
		if($("energyMessages"))$("energyMessages").replace("");
  		var select  = Element('select', {id:'energyMessages'})
  		$('energyMessagesList').insert({'before':select});
	  	
	  	$('energyMessagesList').update("");
		this.settings.energy.each(function(elem, index){
			var a = new Element('li');
			$('energyMessagesList').appendChild(a);
			a.update(elem.energy + ": " + elem.message);
			
	  		var a = new Element('option', {value:index});
	  		a.update(elem.energy + ":" + elem.message);
	  		select.appendChild(a);
		});
	},
	
	getData: function(){
		return this.settings;
	},
	
	open: function(){
		$('settingsDialog').style.display = 'block';
	},
	
	close: function(){
		$('settingsDialog').style.display = 'none';
	}
	
	
	
});

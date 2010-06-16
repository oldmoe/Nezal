var studioSounds = [
	'type_writer',
	'select',
	'match_studio_crowd',
	'arrow_up_down',
	'hover_dashboard',
	'win_hee'
]

var myAudio = {
	load : function(file, volume){
		this[file] = soundManager.createSound({
			  id: file,
			  url: 'audio/mp3/'+file+'.mp3',
			  autoLoad: true,
			  autoPlay: false,
			  onload: function() {
				
			  },
			  volume: volume || 100
		});
		return this[file]
	},
	
	play : function(file){
		if(this[file]){
			this[file].play();
		}
	},
	
	loop : function(file){
		if(this[file]){
			var self = this
			this[file].play();
			this[file].onfinish = function(){
				self[file].play();
			}
		}
	},
	
	playing : function(file){
		if(this[file]){
			return this[file].playState == 1;
		}else{
			return false
		}
	},
	
	stop : function(file){
		if(this[file]){
			this[file].stop();
		}
	},
	
	mute : function(){
		soundManager.mute();
	},
	
	unmute : function(){
		soundManager.unmute();
	},
	
	toggle : function(div){
		if(div.hasClassName('on')){
			div.removeClassName('on');
			div.addClassName('off')
			this.mute();
		}else{
			div.removeClassName('off');
			div.addClassName('on')
			this.unmute();
		}
	}
}

soundManager.url = 'swf/';
soundManager.useHTML5Audio = true;
soundManager.onready(function(){
	studioSounds.each(function(sound){
		myAudio.load(sound);
	})
})
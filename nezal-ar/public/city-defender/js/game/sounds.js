var Sounds = {
	turret : {
		fire : [],
		reload : [],
		rocketPrepare : [],
		rocketLaunch : [],
		patriotLaunch :[]
	},
	doubleTurret : {
		fire : []
	},
	boom : {
		unit : []
	},
	plane : {
		move : []
	},
	superWeapons : {
		weak : [],
		heal : [],
		nuke : [],
		hyper :[]
	},
	gameSounds : {},
	channels : [],
	maxChannels : 10,
	mute : function(){
		soundManager.mute()
		$$('.sound').first().stopObserving('click')
		$$('.sound').first().removeClassName('on')
		$$('.sound').first().addClassName('off')
		$$('.sound').first().observe('click',Sounds.soundOn)
	},
	
	soundOn: function(){
		soundManager.unmute()
		$$('.sound').first().stopObserving('click')
		$$('.sound').first().removeClassName('off')
		$$('.sound').first().addClassName('on')
		$$('.sound').first().observe('click',Sounds.mute)
	},
	
	garbageCollect : function(){
		newChannels = []
		time = new Date
		Sounds.channels.each(function(sound){
			if(sound[0][0].duration <= time - sound[1]){
				sound[0][2]--
			}else{
				newChannels.push(sound)
			}
		})
		Sounds.channels = newChannels
	},
	
	play : function(store, direct){
		if(direct){
			store[0].play()
			return 
		} else {
			this.garbageCollect();
			if(Sounds.channels.length >= Sounds.channelsMax){
				return
			} else if(store[2] >= store[1]){ // max number of concurrent plays exhausted for this sound
				return
			} else {
				Sounds.channels.push([store, new Date])
				store[2]++
				store[0].play()				
			}
		}
		/*
		//if(!game.scene.sound) return
		Sounds.checkFinishedAudio()
		if(Sounds.channels.length == 5) return
		if(direct){
			store[0].load()
			store[0].play()
			return		
		}
		if(store.length > 0){
			var audio = store.pop() 
			Sounds.channels.push({audio : audio , store : store})
			audio.play()
		}
		*/
	},

	checkFinishedAudio : function(){
		var notFinished = []
		Sounds.channels.each(function(channel){
			if(channel.audio.ended){
				channel.audio.load()
				channel.store.push(channel.audio)
			}else{
				notFinished.push(channel)
			} 
		})
		Sounds.channels = notFinished
	},		

	path : function(){
		return 'sounds/sfx/'
	},

	format : 'mp3'
}


var soundNames = ['accept','pause' ,'wash','add_item', 'plane',
'add_money', 'rank_promotion','win', 'lose', 'reject','wrong_tower','click','correct_tower' ]

function createSounds(){
	createAudioElements(5, Sounds.turret.fire,"bullet")
	createAudioElements(5, Sounds.turret.rocketLaunch, "rocket");
	createAudioElements(5, Sounds.turret.patriotLaunch, "patriot");
	createAudioElements(5, Sounds.boom.unit, "explosion")
	createAudioElements(1, Sounds.superWeapons.heal, "heal")
	createAudioElements(1, Sounds.superWeapons.hyper,"hyper")
	createAudioElements(1, Sounds.superWeapons.nuke,"nuke")
	createAudioElements(1, Sounds.superWeapons.weak,"weak")	
	for(var i = 0; i < soundNames.size(); i++){
		Sounds.gameSounds[soundNames[i]] = []
		createAudioElements(3, Sounds.gameSounds[soundNames[i]],soundNames[i])
	}
}
/*
function createAudioElements(count, store, url){
	var audio = createAudioElement(store, url)
	for(var i =0; i< count - 1; i++){
		var audioClone = new Audio
		audioClone.src = audio.src
		store.push(audioClone)
	}
}

function createAudioElement(store, url){
	var audio = new Audio 
	audio.src = Loader.sounds.game[url+"."+Loader.soundsFormat].src
	//audio.load()	
	if(!store)store = []
	store.push(audio);
	return audio
}
*/

function createAudioElements(count, store, url){
	if(!store)store = []
	var sound = soundManager.createSound({
	  id: url,
	  url: 'sounds/sfx/mp3/'+url+'.mp3',
	  autoLoad: true,
	  autoPlay: false,
	  volume: 50
	});
/*
	sound.onfinish = function(){
		store[2] = store[2]--
		Sounds.channelsCount--
	}
*/
	store.push(sound)
	store.push(count)
	store.push(0)
}

soundManager.onready(function() {
  if (soundManager.supported()) {
    // SM2 is ready to go!
    createSounds()
  } 
});

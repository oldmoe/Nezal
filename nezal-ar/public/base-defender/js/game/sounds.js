var Sounds = {
	gameSounds : {},
	channels : [],
	maxChannels : 10,
	muted : false,
	musicOn : true,
	mute : function(){
		Sounds.muted = true
		soundManager.mute()
	},
	
	soundOn: function(){
		Sounds.muted = false
		soundManager.unmute()
	},
	
	switchmusic : function(){
		if(Sounds.musicOn){
			Sounds.musicOn = false
			Sounds.stopTrack()
		}
		else{
			Sounds.musicOn = true
			Sounds.resumeTrack()
		}
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
	resumeTrack : function(){
		if(!Sounds.gameSounds.game||Sounds.muted||!Sounds.musicOn)return
		Sounds.gameSounds.game[0].play()
	},
	pauseTrack : function(){
		if(!Sounds.gameSounds.game||Sounds.muted)return
		Sounds.gameSounds.game[0].pause()
	},
	togglePauseTrack : function(){
		if(!Sounds.gameSounds.game||Sounds.muted||!Sounds.musicOn)return
		Sounds.gameSounds.game[0].togglePause()
	},
	stopTrack : function(){
		if(!Sounds.gameSounds.game||Sounds.muted)return
		Sounds.gameSounds.game[0].stop()
	},
	play : function(store, direct){
		try{
			if(!store)return
			if(Sounds.muted)return 
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
		}catch(e){
			// some error we don't know about
		}
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


var soundNames = ['explosion','click','constructions','resource_collection','slingshot']

function createSounds(){
	for(var i = 0; i < soundNames.size(); i++){
		Sounds.gameSounds[soundNames[i]] = []
		createAudioElements(3, Sounds.gameSounds[soundNames[i]],soundNames[i])
	}
	//createAudioElements(1, Sounds.gameSounds.intro,"intro")
	//createAudioElements(1, Sounds.gameSounds.game,"game")
	createBackgroundMusic()
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

function createAudioElements(count, store, url, loops){
	if(!store)store = []
	var attributes = {
	  id: url,
	  url: 'sounds/sfx/mp3/'+url+'.mp3',
	  autoLoad: true,
	  autoPlay: false,
	  volume: 50
	}
	if(loops) attributes.loops = loops
	var sound = soundManager.createSound(attributes);
	store.push(sound)
	store.push(count)
	store.push(0)
}
function createBackgroundMusic(){
	var introSound = soundManager.createSound({
	  id: "introSound",
	  url: 'sounds/sfx/mp3/intro.mp3',
	  autoLoad: true,
	  autoPlay: false,
	  volume: 30,
	  loops : 10000
	});
	Sounds.gameSounds.Intro= []
	Sounds.gameSounds.Intro.push(introSound)
	var gameSound = soundManager.createSound({
	  id: "gameSound",
	  url: 'sounds/sfx/mp3/background.mp3',
	  autoLoad: true,
	  autoPlay: false,
	  volume: 10,
	  loop : "loop",
	  loops : 10000
	});
	Sounds.gameSounds.game= []
	Sounds.gameSounds.game.push(gameSound)
}

soundManager.onready(function() {
  if (soundManager.supported()) {
    // SM2 is ready to go!
    createSounds()
  }
});
soundManager.ontimeout(function() {
     createSounds()
});


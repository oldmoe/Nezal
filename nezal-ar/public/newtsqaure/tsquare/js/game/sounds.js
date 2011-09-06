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
		if(!Sounds.gameSounds.game||Sounds.muted)returnss
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
					if(store[0])store[0].load()			
					if(store[0])store[0].play()				
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


var soundNames = ['beat','correct_move']

function createSounds(){
	for(var i = 0; i < soundNames.size(); i++){
		Sounds.gameSounds[soundNames[i]] = []
		createAudioElements(3, Sounds.gameSounds[soundNames[i]],soundNames[i])
	}
	//createAudioElements(1, Sounds.gameSounds.intro,"intro")
	//createAudioElements(1, Sounds.gameSounds.game,"game")
	//createBackgroundMusic()
}

function createAudioElements(count, store, url, loops){
	if(!store)store = []
  
  var sound = new Audio()
  sound.src = 'sounds/sfx/mp3/'+url+'.mp3'	
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

createSounds()


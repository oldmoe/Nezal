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

	play : function(store, direct){
		store[0].play()
		return 
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

	format : 'ogg'
}

var test = new Audio
if(test.canPlayType('audio/mpeg')){
	Sounds.format = 'mp3'	
}
else if(test.canPlayType('audio/ogg')){
	Sounds.format = 'ogg'	
}

var soundNames = ['accept','pause' ,'wash','add_item', 'plane',
'add_money', 'rank_promotion','win', 'lose', 'reject','wrong_tower','click','correct_tower' ]

function createSounds(){
	createAudioElements(2, Sounds.turret.fire,"bullet")
	createAudioElements(2, Sounds.turret.rocketLaunch, "rocket");
	createAudioElements(2, Sounds.turret.patriotLaunch, "patriot");
	createAudioElements(2, Sounds.boom.unit, "explosion")
	createAudioElements(1, Sounds.superWeapons.heal, "heal")
	createAudioElements(1, Sounds.superWeapons.hyper,"hyper")
	createAudioElements(1, Sounds.superWeapons.nuke,"nuke")
	createAudioElements(1, Sounds.superWeapons.weak,"weak")	
	for(var i = 0; i < soundNames.size(); i++){
		Sounds.gameSounds[soundNames[i]] = []
		createAudioElements(1, Sounds.gameSounds[soundNames[i]],soundNames[i])
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
	var sound = soundManager.createSound({
	  id: url,
	  url: 'sounds/sfx/mp3/'+url+'.mp3',
	  autoLoad: true,
	  autoPlay: false,
	  volume: 50
	});
	if(!store)store = []
	store.push(sound)
}

soundManager.onready(function() {
  if (soundManager.supported()) {
    // SM2 is ready to go!
    createSounds()
  } else {
    alert('el7a2oooooony!!! ana ba2eeet a\'7raaaaas')
  }
});

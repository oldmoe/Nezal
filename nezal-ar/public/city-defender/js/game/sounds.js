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
		//if(!game.scene.sound) return
		Sounds.checkFinishedAudio()
		if(Sounds.channels.length == 8) return
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

	registerAudioCleaner : function(reactor){
		Sounds.reactor = reactor
		reactor.push(1, Sounds.checkFinishedAudio)
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
'add_money', 'rank_promotion','win', 'lose'   ,   'reject','wrong_tower','click','correct_tower' ]

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
		createAudioElements(1, Sounds.gameSounds[soundNames[i]],soundNames[i])
	}
}

function createAudioElements(count, store, url){
	var audio = createAudioElement(store, url)
	for(var i =0; i< count - 1; i++){
		store.push(audio.clone())
	}
}

function createAudioElement(store, url){
	var audio =new Audio 
	audio.src = Loader.sounds.game[url+"."+Loader.soundsFormat].src
	//audio.load()	
	if(!store)store = []
	store.push(audio);
	return audio
}

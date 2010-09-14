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

createSounds()
function createSounds(){
	createAudioElements(5, Sounds.turret.fire, Sounds.path()+Sounds.format+"/bullet."+Sounds.format)
	createAudioElements(5, Sounds.turret.rocketLaunch, Sounds.path()+Sounds.format+"/rocket."+Sounds.format);
	createAudioElements(5, Sounds.turret.patriotLaunch, Sounds.path()+Sounds.format+"/patriot."+Sounds.format);
	createAudioElements(5, Sounds.boom.unit, Sounds.path()+Sounds.format+"/explosion."+Sounds.format)
	createAudioElements(1, Sounds.superWeapons.heal, Sounds.path()+Sounds.format+"/heal."+Sounds.format)
	createAudioElements(1, Sounds.superWeapons.hyper, Sounds.path()+Sounds.format+"/hyper."+Sounds.format)
	createAudioElements(1, Sounds.superWeapons.nuke, Sounds.path()+Sounds.format+"/nuke."+Sounds.format)
	createAudioElements(1, Sounds.superWeapons.weak, Sounds.path()+Sounds.format+"/weak."+Sounds.format)	
	for(var i = 0; i < soundNames.size(); i++){
		Sounds.gameSounds[soundNames[i]] = []
		createAudioElements(1, Sounds.gameSounds[soundNames[i]], Sounds.path()+Sounds.format+"/"+soundNames[i]+"."+Sounds.format)
	}
}

function createAudioElements(count, store, url){
	var audio = createAudioElement(store, url)
	for(var i =0; i< count - 1; i++){
		store.push(audio.clone())
	}
}

function createAudioElement(store, url){
	var audio = new Audio(url)
	audio.load()	
	if(!store)store = []
	store.push(audio);
	return audio
}

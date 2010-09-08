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

	play : function(store){
		if(Sounds.channels.length == 10) return
		//if(!game.scene.sound) return
		if(store.length > 0){
			Sounds.channels.push(store.pop())
			Sounds.channels.last().play()
			//store.pop().play()
		}
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
'add_money', 'rank_promotion','win', 'lose'   ,   'reject','wrong_tower','click','correct_tower' , 'select']

createSounds()
function createSounds(){
	createAudioElements(5, Sounds.turret.fire, Sounds.path()+Sounds.format+"/bullet."+Sounds.format)
	console.log(Sounds.turret.fire)
	createAudioElements(5, Sounds.doubleTurret.fire, Sounds.path()+Sounds.format+"/bullet."+Sounds.format)
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
function createAudioElements(count, store, url, func){
	for(var i = 0; i < count; i++){
		createAudioElement(store, url, func)
	}
}

function createAudioElement(store, url, func){
	var audio = new Audio(url)	
	if(!store)store = []
	Event.observe(audio, 'ended', function(){
		//console.log('ending')		
		audio.load()
		store.push(audio);
		Sounds.channels.splice(Sounds.channels.indexOf(audio), 1);
		if(func){func()}
		//console.log('ended')		
	});
	store.push(audio);
}

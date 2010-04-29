var Sounds = {
	turret : {
		fire : [],
		reload : [],
		rocketPrepare : [],
		rocketLaunch : []
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
	
	play : function(store){
		if(!Game.sound) return
		if(store.length > 0){
			store.pop().play()
		}
	},
	
	format : 'wav',
	path : '/city-defender/sounds/effects/'	
}

var test = new Audio
if(test.canPlayType('audio/ogg')){
	Sounds.format = 'ogg'	
}else if(test.canPlayType('audio/mpeg')){
	Sounds.format = 'mp3'	
}
if(window.location.protocol == 'file:'){
	Sounds.path = 'sounds/effects/'
}

createAudioElements(5, Sounds.turret.fire, Sounds.path+Sounds.format+"/ShotGunFire."+Sounds.format)
createAudioElements(5, Sounds.doubleTurret.fire, Sounds.path+Sounds.format+"/ShotGunFire."+Sounds.format)
createAudioElements(5, Sounds.turret.rocketLaunch, Sounds.path+Sounds.format+"/ROCKETRELEASE."+Sounds.format);
createAudioElements(5, Sounds.boom.unit, Sounds.path+Sounds.format+"/explosion."+Sounds.format)

function createAudioElements(count, store, url, func){
	for(var i = 0; i < count; i++){
		createAudioElement(store, url, func)
	}
}

function createAudioElement(store, url, func){
	var audio = new Audio(url)
	//audio.onended = function(){ store.push(audio) }
	audio.observe("ended", function(){store.push(audio); if(func){func()}});  
	store.push(audio);
}

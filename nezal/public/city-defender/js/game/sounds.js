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
		if(store.length > 0){
			store.pop().play()
		}
	}
		
}

createAudioElements(5, Sounds.turret.fire, "sounds/effects/ShotGunFire.wav")
createAudioElements(5, Sounds.doubleTurret.fire, "sounds/effects/ShotGunFire.wav")
//createAudioElements(5, Sounds.doubleTurret.fire, "sounds/effects/MiniGunFire.wav")
createAudioElements(5, Sounds.turret.rocketLaunch, "sounds/effects/ROCKETRELEASE.WAV");
createAudioElements(5, Sounds.boom.unit, "sounds/effects/explosion.wav")

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

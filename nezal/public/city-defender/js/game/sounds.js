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
	}
		
}

createAudioElements(5, Sounds.turret.fire, "sounds/effects/ogg/ShotGunFire.ogg")
createAudioElements(5, Sounds.doubleTurret.fire, "sounds/effects/ogg/ShotGunFire.ogg")
createAudioElements(5, Sounds.turret.rocketLaunch, "sounds/effects/ogg/ROCKETRELEASE.ogg");
createAudioElements(5, Sounds.boom.unit, "sounds/effects/ogg/explosion.ogg")

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

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
	
	channels : [],
	
	play : function(store){
		if(Sounds.channels.length == 5) return
		if(!Game.sound) return
		if(store.length > 0){
			Sounds.channels.push(store.pop())
			Sounds.channels.last().play()
			//store.pop().play()
		}
	},
	
	format : 'wav',
	path : '/city-defender/sounds/Effects/'	
}

var test = new Audio
if(test.canPlayType('audio/ogg')){
	//Sounds.format = 'ogg'	
}else if(test.canPlayType('audio/mpeg')){
	//Sounds.format = 'mp3'	
}
if(window.location.protocol == 'file:'){
	Sounds.path = 'sounds/Effects/'
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
	audio.observe("ended", function(){
		store.push(audio);
		Sounds.channels.splice(Sounds.channels.indexOf(audio), 1);
		if(func){func()}
	});  
	store.push(audio);
}

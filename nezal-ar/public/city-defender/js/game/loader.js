//loads images and store them in memory for later use


var Loader = {
	initialize: function (){
		var test = new Audio
		if(test.canPlayType('audio/mpeg')){
			this.soundsFormat = 'mp3'	
		}
		else if(test.canPlayType('audio/ogg')){
			this.soundsFormat = 'ogg'	
		}							
		this.toLoad = ["animations.html", "intro.html", this.soundsFormat+".html", "user.html", "background.html",  "game.html"]
		this.soundIndex = this.toLoad.indexOf(this.soundsFormat+".html")
	},

	notify : function(win, resources,callback){
		var div = win.document.getElementById('resources')
		var i =0
		while(resources.length>i){
			var resource = resources[i]
			if(this.index==this.soundIndex)i++
			else resource = div.removeChild(resource)
			var id = resource.id
			var parts = id.split('#')
			if(this.index>this.toLoad.length-1)console.log(parts[0],parts[1],parts[2])
			if(!Loader[parts[0]][parts[1]])Loader[parts[0]][parts[1]] = {}
			Loader[parts[0]][parts[1]][parts[2]] = resource; 
		}
		if(this.index==this.soundIndex) createSounds()
		if(this.index == this.toLoad.length-1){
			this.index++
			if(development){
				city_defender_start()
				onFinish()
			}
			else Intro.show()
		}
		else if(this.index < this.toLoad.length-1){
			this.index++
			window.setTimeout(function(){$('iframe').src = "html_resources/"+Loader.toLoad[Loader.index]}, 500)
		}
		if(this.challengeCallback){
			this.challengeCallback()
			this.challengeCallback = null
		}
	},
	
	loadChallenge : function(challenge,callback){
		this.challengeCallback = callback
		$('iframe').src = "html_resources/"+challenge+".html"
	}	
}
Loader.initialize()
Loader.images ={}
Loader.sounds = {}
Loader.animations = {}
Loader.challenges = {}
Loader.resourceTypes = ['images', 'sounds','animations']
Loader.index = 0



//initLoadImages()

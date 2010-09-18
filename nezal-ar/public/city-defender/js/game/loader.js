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
		this.toLoad = ["animations.html","challenges.html", "intro.html", this.soundsFormat+".html", "user.html", "background.html",  "game.html"]
	},

	notify : function(win, resources){
		var div = win.document.getElementById('resources')
		var i =0
		while(resources.length>i){
			var resource = resources[i]
			if(this.index==3)i++
			else resource = div.removeChild(resource)
			var id = resource.id
			var parts = id.split('/')
			if(!Loader[parts[0]][parts[1]])Loader[parts[0]][parts[1]] = {}
			Loader[parts[0]][parts[1]][parts[2]] = resource; 
		}
		if(this.index == 3) createSounds()
		if(this.index < this.toLoad.length-1){
			this.index++
			window.setTimeout(function(){$('iframe').src = "html_resources/"+Loader.toLoad[Loader.index]}, 500)
		}
		else{
			if(development){
				city_defender_start()
				onFinish()
			}
			else Intro.show()
		}
	}	

}
//new ResourceLoader().load()
Loader.initialize()
Loader.images ={}
Loader.sounds = {}
Loader.animations = {}
Loader.resourceTypes = ['images', 'sounds','animations']
Loader.index = 1



//initLoadImages()

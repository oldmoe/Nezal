//loads images and store them in memory for later use


var Loader = {

  callbacks: {},

	initialize: function (){
		var test = new Audio
		if(test.canPlayType('audio/mpeg')){
			this.soundsFormat = 'mp3'	
		}
		else if(test.canPlayType('audio/ogg')){
			this.soundsFormat = 'ogg'	
		}							
		this.toLoad = ["animations.html", "intro.html", this.soundsFormat+".html", "user.html", "background.html",  "game.html", "english.html", "arabic.html"]
		this.soundIndex = this.toLoad.indexOf(this.soundsFormat+".html")
	},

	notify : function(win, resources){
		var div = win.document.getElementById('resources')
		var i =0
		while(resources.length>i){
			var resource = resources[i]
			if(this.index==this.soundIndex)i++
			else resource = div.removeChild(resource)
			var id = resource.id
			var parts = id.split('#')
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
			else{
        Loader.doneLoading = true;
        Intro.start();
			}
		}
		else if(this.index < this.toLoad.length-1){
  		var callbackKey = win.document.URL.split('/').pop();
  		if(this.toLoad.indexOf(callbackKey)>=0)
  		{
			    this.index++
			    window.setTimeout(function(){$('iframe').src = "html_resources/"+Loader.toLoad[Loader.index]}, 500)
	    }
		}
		var callbackKey = win.document.URL.split('/').pop();
		if(this.callbacks[callbackKey]){
			this.callbacks[callbackKey]();
			this.callbacks[callbackKey] = null;
		}
	},
	
	loadPage : function(page, callback){
		this.callbacks[page+".html"] = callback;
		$('pages').src = "html_resources/"+page+".html"
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

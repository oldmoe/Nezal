//loads images and store them in memory for later use


var Loader = {

  callbacks: {},

	initialize: function (){
		this.toLoad = ["animations.html", "intro.html", "user.html", "background.html",  "game.html", "english.html", "arabic.html", "french.html"]
	},

	notify : function(win, resources){
		var div = win.document.getElementById('resources')
		while(resources.length>0){
			var resource = resources[0]
			resource = div.removeChild(resource)
			var id = resource.id
			var parts = id.split('#')
			if(!Loader[parts[0]][parts[1]])Loader[parts[0]][parts[1]] = {}
			Loader[parts[0]][parts[1]][parts[2]] = resource;
		}
		if(this.index == this.toLoad.length-1){
			this.index++
			if(development){
				city_defender_start()
				onFinish()
			}else{
				Loader.doneLoading = true;
				Intro.start();
			}
		}else if(this.index < this.toLoad.length-1){
			var found = false
			this.toLoad.each(function(url){
				if(win.document.URL.indexOf(url.split('?')[0])>=0){
					found = true
				}
			})
			if(found){
				this.index++
				window.setTimeout(function(){$('iframe').src = Loader.toLoad[Loader.index]}, 100)
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

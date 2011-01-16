//loads images and store them in memory for later use


var Loader = {

	dumb : false,
	
	callbacks: {},

	events : {
		intro : {
			loaded : false, 
			onLoad : function(){ 
			//Loader.doneLoading = true; 
			Intro.start(); 
		}},
		tutorial : {loaded : false, onLoad : null},
		game : {loaded : false, onLoad : null},
		/*
		function(){
			Loader.loadPage(GameConfigs.campaign, function(){Loader.fire('challenge')})
		}}*/
		challenge : {loaded : false, onLoad : null}
	},
	loaded :{},
	fire : function(event){
		Loader.events[event].loaded = true;
		if(Loader.events[event].onLoad)Loader.events[event].onLoad();
	},
	fileLoading :null,

	notify : function(win, resources, dumb){
		if(Loader.toLoad[Loader.index]&&Loader.toLoad[Loader.index].split)Loader.loaded[Loader.toLoad[Loader.index].split('.')[0]]=true
		if(!dumb){
			for(var i=0; i < resources.length-1 ;i++){	
				var image = new Image
				var resource = resources[i]
				var id = resource[0]
				var parts = id.split('#')
				if(!Loader[parts[0]][parts[1]])Loader[parts[0]][parts[1]] = {}
				image.setAttribute('data', resource[1])
				image.src = resource[1]
				Loader[parts[0]][parts[1]][parts[2]] = image;
			}
		}else{
			for(var i=0; i < resources.length ;i++){	
				var image = new Image
				var resource = resources[i]
				var id = resource.id
				var parts = id.split('#')
				if(!Loader[parts[0]][parts[1]])Loader[parts[0]][parts[1]] = {}
				image.setAttribute('data', resource.src)
				image.src = resource.src
				Loader[parts[0]][parts[1]][parts[2]] = image;
			}
		}
		if(Loader.toLoad[Loader.index+1] && Loader.toLoad[Loader.index+1].constructor == Function){
			this.index++
			Loader.toLoad[Loader.index]()
		}
		if(this.index >= this.toLoad.length-1){
			this.index++
			if(development){
				city_defender_start()
				onFinish()
			}else{
				Loader.doneLoading = true;
				//Intro.start();
			}
		}else if(this.index < this.toLoad.length-1){
			var found = false
			this.toLoad.each(function(url){
				if(url.constructor == Function) return
				if(win.document.URL.indexOf(url.split('?')[0])>=0){
					found = true
				}
			})
			if(found){
				this.index++
				Intro.startFileLoading(Loader.toLoad[Loader.index].split('.')[0])
				$('iframe').src = Loader.toLoad[Loader.index]
			}
		}
		var callbackKey = win.document.URL.split('/').pop();
		if(this.callbacks[callbackKey]){
			this.fire('challenge')
			this.callbacks[callbackKey]();
			this.callbacks[callbackKey] = null;
		}
	},
	
	loadPage : function(page, callback){
		page = Loader.dumb ? page + '_dumb' : page
		this.callbacks[page+".html"] = callback;
		$('pages').src = "html_resources/"+page+".html"
	}	
	
}
Loader.images ={}
Loader.sounds = {}
Loader.animations = {}
Loader.challenges = {}
Loader.resourceTypes = ['images', 'sounds','animations']
Loader.index = 0



//initLoadImages()

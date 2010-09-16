//loads images and store them in memory for later use


var Loader = {
	initialize: function (){
		this.toLoad = ["animations.html","challenges.html", "intro.html", this.soundsFormat+".html", "user.html", "background.html",  "game.html"]
	},
	/*
	this method loads the images
		@imageNames 		    array of names of the images for ex: ['tank.png','creep.png']
		path 					the path that contains the images for ex: c:/images/
		onProgress			  	a callback that takes a parameter "progress" and it's called each time an image is loaded
		onFinish				a callback that is called after all images are loaded
	*/
	load : function(){
			var test = new Audio
			if(test.canPlayType('audio/mpeg')){
				this.soundsFormat = 'mp3'	
			}
			else if(test.canPlayType('audio/ogg')){
				this.soundsFormat = 'ogg'	
			}							
			this.div = document.createElement('div');
			var self = this
			this.loadResource(toLoad,0)
				
			/*
			toLoad.each(function(resource){
		    new Ajax.Request( 'HTMLResources/'+resource, {method:'get',
                      onSuccess: function(t){
												console.log('here']
												self.div.innerHTML = t.responseText
												console.log(self.div.getElementByID('ok.png'))
                      } 
        });
			})
			*/
	},
	notify : function(win, images){
		var div = win.document.getElementById('resources')
		while(images.length>0){
			var image = images[0]
			image = div.removeChild(image)
			var id = image.id
			var parts = id.split('/')
			if(!Loader[parts[0]][parts[1]])Loader[parts[0]][parts[1]] = {}
		//	console.log(parts[0],parts[1],parts[2])
			Loader[parts[0]][parts[1]][parts[2]] = image; 
		}
		if(this.index < this.toLoad.length-1){
			this.index++
			window.setTimeout(function(){$('iframe').src = "HTMLResources/"+Loader.toLoad[Loader.index]}, 500)
		}
		else{
			Intro.show()
		}
	}	

}
//new ResourceLoader().load()
Loader.images ={}
Loader.sounds = {}
Loader.animations = {}
Loader.resourceTypes = ['images', 'sounds','animations']
Loader.index = 1
Loader.toLoad = ["animations.html","challenges.html", "intro.html", "user.html", "background.html",  "game.html"]
	


//initLoadImages()

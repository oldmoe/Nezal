//loads images and store them in memory for later use

var Loader = Class.create({
  initialize: function (){
    this.loadedResources =0
    this.chunk = 25
  },
  /*
  this method loads the images
    @imageNames         array of names of the images for ex: ['tank.png','creep.png']
    path          the path that contains the images for ex: c:/images/
    onProgress          a callback that takes a parameter "progress" and it's called each time an image is loaded
    onFinish        a callback that is called after all images are loaded
  */
  setLength : function(resources){
    this.currentLength = 0
    var self = this
    resources.each(function(resource){
      Loader.resourceTypes.each(function(type){
        if(resource[type]){
          self.currentLength += resource[type].length
        }
      })
    })
  },  

  load : function(resources, options){
  	console.log(options)
    this.resources = resources
    this.options = options
    if(this.loadedResources==0)this.setLength(resources)
    var self = this
    var objects = []
    var toLoad = []
    var l =0
    var remainedResources = []
    this.resources.each(function(resource){
      Loader.resourceTypes.each(function(type){
        if(resource[type]){
          var names = resource[type]
          if(l>self.chunk)  remainedResources.push(resource)
          if(names.length+l<self.chunk){
            l+=names.length
            toLoad.push(Nezal.clone_obj(resource))
            resource[type]= []
          }
          else{
            var n = Nezal.clone_obj(resource)
            n[type] = resource[type].splice(0,self.chunk-l)
            toLoad.push(n)
            l=self.chunk
            remainedResources.push(resource)
          }
        }
      })
    })
    this.resources = remainedResources

    toLoad.each(function(resource){
      Loader.resourceTypes.each(function(type){
        if(resource[type]){
          var path = resource.path || type+'/game/'
          var store = resource.store
          var names = resource[type]
          self.loadResources(path,store,names,type)
        }
      })
    })
  },

  loadResource : function(){
    var self = this
    var resource = this.resources[0]
      Loader.resourceTypes.each(function(type){
        if(resource[type]){
          var path = resource.path || type+'/game/'
          var store = resource.store
          var names = resource[type]
          if(names.length==1)self.resources.splice(0,1)
          self.loadResources(path,store,names.splice(0,1),type)
        }
      })
  },
  loadResources : function(path,store,names,type){
    var self = this
    if(!Loader[type][store])Loader[type][store] = {}
    for ( var  i=0 ; i < names.length ; i++ ){
      if(!Loader[type][store][names[i]]){ 
      var src = ''
      src = path + names[i]
      Loader[type][store][names[i]] = self['load_'+type](src, this.options);
      }else{
      self.loadedResources++
      }
      //objects[names[i]] = Loader[type][store][names[i]]
    }
      if(self.loadedResources == self.currentLength){
        self.loadedResources = 0
        if(options.onFinish){
          options.onFinish()
        }
      } 
  },
  onload: function(img,options){
    this.loadedResources++;
    if(options.onProgress) options.onProgress(Math.round((this.loadedResources/this.currentLength)*100))
    if(this.loadedResources == this.currentLength){
      this.loadedResources = 0
      if(options.onFinish){
        options.onFinish()
      }
    } 
    else if(this.resources.length>0){
      this.loadResource()
    }
  },

  load_images : function(src, options){
    var image = new Image();
    var self = this
    image.onload = function(){self.onload(image, options);}
    image.src = src
    return $(image)
  },
  
  load_sounds : function(src, options){
    var audio = new Audio();
    audio.onload = function(){self.onload(options);}
    audio.src = src
    return audio
  },
  load_animations :function(src,options){
    return this.load_images(src,options)
  }
})

Loader.images ={}
Loader.sounds = {}
Loader.animations = {}
Loader.resourceTypes = ['images', 'sounds','animations']
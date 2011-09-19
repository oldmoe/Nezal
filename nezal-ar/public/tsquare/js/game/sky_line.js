var SkyLine = Class.create({
	
	initialize: function(scene){
    	this.backgrounds = []
    	this.scene = scene
    	
    	//var images_cloud = [Loader.images.background[game.data.backgrounds[2][0].name]]
    	var images = [Loader.images.background[game.data.backgrounds['layer1'][0].name]]
        var images_streetMarks = [Loader.images.background['street_marks.png']]
    	var images_transparent = [Loader.images.background[game.data.backgrounds['layer1'][0].name]]
    	var images_road = [Loader.images.background['land.png'], Loader.images.background['land.png']]
    		
        var self = this
       // var background_cloud = new Background(this.scene, {speed : function(){return self.scene.direction*(self.scene.currentSpeed  -2)}, y: 0, imagesCount: 3, images:images_cloud})
        var background_road = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed)}, y: 167, imagesCount: 6, images:images_road})
        var background_transparent = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed -2)}, y: 0, imagesCount: 3, images:images_transparent},{opacity:0.4})
        var background = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed-1)}, y: 20, imagesCount: 3, images:images})
        var background_street_marks = new Background(this.scene, {speed : function(){return  self.scene.direction*(self.scene.currentSpeed)}, y: 265, imagesCount: 2, images:images_streetMarks})
            
    	this.backgrounds.push(background_transparent)       
    	this.backgrounds.push(background)
    	//this.backgrounds.push(background_cloud)
    	this.backgrounds.push(background_road)
        this.backgrounds.push(background_street_marks)
    		
    	for(var i=0; i<this.backgrounds.length; i++){
    		scene.objects.push(this.backgrounds[i])
    		scene.pushToRenderLoop('skyline',this.backgrounds[i])
    	}
	}
});
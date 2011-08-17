var SkyLine = Class.create({
	
	initialize: function(scene){
		
		this.backgrounds = []
		this.scene = scene
		
		var images_cloud = [Loader.images.background['sky1.png']]
		var images = [Loader.images.background['skyline.png'], Loader.images.background['skyline.png']]
    var images_streetMarks = [Loader.images.background['street_marks.png'], Loader.images.background['street_marks.png']]
		var images_transparent = [Loader.images.background['skyline.png'], Loader.images.background['skyline.png']]
		var images_road = [Loader.images.background['land.png'], Loader.images.background['land.png']]
		
    var self = this
    
    var background_cloud = new Background(this.scene, {speed : function(){return self.scene.speed-2}, y: 0, imagesCount: 3, images:images_cloud})
    var background_road = new Background(this.scene, {speed : function(){return self.scene.speed}, y: 167, imagesCount: 6, images:images_road})
		var background_transparent = new Background(this.scene, {speed : function(){return self.scene.speed-2}, y: 0, imagesCount: 3, images:images_transparent},{opacity:0.4})
		var background = new Background(this.scene, {speed : function(){return self.scene.speed-1}, y: 20, imagesCount: 3, images:images})
    var background_street_marks = new Background(this.scene, {speed : function(){return self.scene.speed}, y: 265, imagesCount: 2, images:images_streetMarks})
		
		this.backgrounds.push(background_transparent)
		this.backgrounds.push(background)
		this.backgrounds.push(background_cloud)
		this.backgrounds.push(background_road)
    this.backgrounds.push(background_street_marks)
		
		for(var i=0; i<this.backgrounds.length; i++){
			scene.objects.push(this.backgrounds[i])
			scene.pushToRenderLoop('skyline',this.backgrounds[i])
		}
		
	}
});
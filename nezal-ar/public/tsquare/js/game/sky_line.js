var SkyLine = Class.create({
	
	initialize: function(scene){
		
		this.backgrounds = []
		this.scene = scene
		
		var images_cloud = [Loader.images.background['cloud.jpg'], Loader.images.background['cloud.jpg']]
		var images = [Loader.images.background['skyline.png'], Loader.images.background['skyline.png']]
		var images_transparent = [Loader.images.background['skyline_transparent.png'], Loader.images.background['skyline_transparent.png']]
		var images_road = [Loader.images.background['road.jpg'], Loader.images.background['road.jpg']]
		
		var background_transparent = new Background(this.scene, {speed : 1, y: 0, imagesCount: 3, images:images_transparent})
		var background = new Background(this.scene, {speed : 2, y: 20, imagesCount: 3, images:images})
		var background_cloud = new Background(this.scene, {speed : 1, y: 0, imagesCount: 1, images:images_cloud})
		var background_road = new Background(this.scene, {speed : 1, y: 180, imagesCount: 6, images:images_road})
		
		this.backgrounds.push(background_transparent)
		this.backgrounds.push(background)
		this.backgrounds.push(background_cloud)
		this.backgrounds.push(background_road)
		
		for(var i=0; i<this.backgrounds.length; i++){
			scene.objects.push(this.backgrounds[i])
			scene.pushToRenderLoop('skyline',this.backgrounds[i])
		}
		
	}
});
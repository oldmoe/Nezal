var SkyLine = Class.create({
	
	initialize: function(scene){
		
		this.backgrounds = []
		this.scene = scene
		
		var images_cloud = [Loader.images.skyLine['cloud.jpg'], Loader.images.skyLine['cloud.jpg']]
		var images = [Loader.images.skyLine['skyline.png'], Loader.images.skyLine['skyline.png']]
		var images_transparent = [Loader.images.skyLine['skyline_transparent.png'], Loader.images.skyLine['skyline_transparent.png']]
		
		var background_transparent = new Background(this.scene, {speed : 1, y: 0, imagesCount: 3, images:images_transparent})
		var background = new Background(this.scene, {speed : 2, y: 20, imagesCount: 3, images:images})
		var background_cloud = new Background(this.scene, {speed : 1, y: 0, imagesCount: 1, images:images_cloud})
		
		this.backgrounds.push(background_transparent)
		this.backgrounds.push(background)
		this.backgrounds.push(background_cloud)
		
		for(var i=0; i<this.backgrounds.length; i++){
			scene.objects.push(this.backgrounds[i])
			scene.pushToRenderLoop('skyline',this.backgrounds[i])
		}
		
	}
});
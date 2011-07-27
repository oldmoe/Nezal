var Game = Class.create({
	
	initialize: function(){
		
		this.tsquareScene = new TsquareScene()
		
		var backgroundImages = ['skyline.png', 'skyline_transparent.png', 'cloud.jpg', 'road.jpg']
		
		var self = this
		new Loader().load([{images: backgroundImages, path: 'images/background/', store: 'background'}], {onFinish:function(){
			self.tsquareScene.start()
		}})
		
	}
	
	
});
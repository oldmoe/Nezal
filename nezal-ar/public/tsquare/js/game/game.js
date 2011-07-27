var Game = Class.create({
	
	initialize: function(){
		
		this.tsquareScene = new TsquareScene()
		
		var skyLineImages = ['skyline.png', 'skyline_transparent.png', 'cloud.jpg']
		var self = this
		new Loader().load([{images: skyLineImages, path: 'images/skyline/', store: 'skyLine'}], {onFinish:function(){
			self.tsquareScene.start()
		}})
		
	},
	
	
});
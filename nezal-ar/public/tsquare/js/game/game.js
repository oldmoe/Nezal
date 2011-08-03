var Game = Class.create({
	
	initialize: function(){
		
		this.scene = new TsquareScene()
		
		var backgroundImages = ['skyline.png', 'skyline_transparent.png', 'cloud.jpg', 'road.jpg']
		var gameElementsImages = ['arrow_up.png','arrow_down.png', 'bubble.png']
    var characterImages = ['crowd_member.png','follower.png', 'npc.png']
    var enemiesImages = ['block.png']
		var self = this
		new Loader().load([{images: backgroundImages, path: 'images/background/', store: 'background'},
    {images: gameElementsImages, path: 'images/game_elements/', store: 'gameElements'},
    {images: characterImages, path: 'images/characters/', store: 'characters'},
    {images: enemiesImages, path: 'images/enemies/', store: 'enemies'}], {onFinish:function(){
			self.scene.start()
		}})
		
	}
	
	
});
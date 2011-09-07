var Game = Class.create({
	
	initialize: function(ctx){
		this.ctx = ctx
		this.initializeGame();
	},
	
	initializeGame: function(){
		
		var gameElementsImages = [
		"air_craft_in_action.png", 
		"air_craft.png", 
		"humvee_body.png",
		 "humvee_tower_in_action.png", 
		 "humvee_tower.png"];
		 
		this.scene = new GameScene(this.ctx)
		var self = this
		
		new Loader().load([{images : gameElementsImages, path: 'images/', store: 'game_elements'}], {onFinish:function(){
			self.scene.start();
			new GameController(this)
		}});
		
	}
});


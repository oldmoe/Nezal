var GameController = Class.create({
	
	initialize: function(game){
		this.game = game
		var self = this
		document.observe("keydown", function(evt){
			alert(evt.keyCode)
			//key codes, 37 left, 39 right, 38 up, 40 down
			if(evt.keyCode == 37){ //left
				self.game.scene.jet.owner.x--;
			}else if(evt.keyCode == 38){//up
				
			}else if(evt.keyCode == 39){//right
				
			}else if(evt.keyCode == 40){//down
				
			}
		})
	},
	
	start: function(){
	}
});

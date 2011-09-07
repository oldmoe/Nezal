var Display = Class.create({
	initialize : function(owner){
		this.owner = owner;
		this.initImages();
	},
	update : function(){},
    finish : function(){}
})

var JetDisplay = Class.create(Display,{
  initialize : function($super,owner){
    $super(owner)
	this.sprite = new Sprite([this.images.jet],owner, {rotation:0})
  },
  initImages : function(){
		this.images = {
			jet : Loader.images.game_elements['air_craft.png']
		}
	},
})


var HumveeDisplay = Class.create(Display, {
	
	initialize: function(owner){
		this.owner = owner;
		this.initImages();
		this.sprite = new CompositeUnitSprite(this.images, this.owner, {rotation:90})
	},
	
 	initImages : function(){
		this.images = {
			base : Loader.images.game_elements['humvee_body.png'],
			cannon : Loader.images.game_elements['humvee_tower.png'],
			fire : Loader.images.game_elements['humvee_tower_in_action.png']
		}
	}
})

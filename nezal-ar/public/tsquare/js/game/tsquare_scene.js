var TsquareScene = Class.create(Scene,{
	
	initialize: function($super,game){
		$super(game)
		this.width = 760
		this.height = 550
		this.createRenderLoop('skyline',1) 
	},
	
	init: function(){
		this.skyLine = new SkyLine(this)
	}
});
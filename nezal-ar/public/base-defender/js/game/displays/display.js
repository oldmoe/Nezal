var Display = Class.create({
  xdim :0,
	ydim:0,
	zdim:0,
	imgWidth:0,
	imgHeight:0,
	moving : false ,
	rotating : false,
	targetAngle :0,
	angle : 0,
	initialize : function(owner,properties){
		Object.extend(this,properties)
		this.owner = owner
	},
	 collides : function(u){
		return Util.collision(this,u)
	 },
	 distance : function(u){
		return Math.sqrt(Math.pow(u.x-this.x,2)+Math.pow(u.y-this.y,2))
	 },
	 getNextMove : function(){
		if(this.x!=this.goalX || this.y!=this.goalY){
			var movement = Util.getNextMove(this.x,this.y,this.goalX,this.goalY,this.speed)
		}
	 }
});

var BuildingDisplay = Class.create(Display, {
	
  initialize : function($super,owner,properties){
		$super(owner,properties)
		this.owner = owner
		this.img = Loader.images.buildings[this.owner.name+'.png'];
		this.invalidImg =  Loader.images.buildings[this.owner.name+'_invalid.png'];
		this.mapTiles =[];
		this.sprite = new DomSprite(owner,this.img);
		//this.invalideBuildingSprite = new DomSprite(owner,this.img);
		Object.extend(this.owner,this);
		this.render();
	},
	
	stateChanged : function(){
		switch(this.owner.state){
			case this.owner.states.NOT_PLACED:
				this.sprite.setOpacity(0.5);
				break;
			case this.owner.states.UNDER_CONSTRUCTION:
				this.sprite.setOpacity(0.5);
				break;
			case this.owner.states.UPGRADING:
				this.sprite.setOpacity(0.5);
				break;
			case this.owner.states.NORMAL:	
				this.sprite.setOpacity(1);
				break;
		}		
	},
	
	render : function(){
		this.sprite.render();
	},
	
	destroy : function(){
		console.log(this)
		this.sprite.destroy()
	}
	
});

var TownhallDisplay = Class.create(BuildingDisplay, {
	
});

var MineDisplay = Class.create(BuildingDisplay, {
  
});

var QuarryDisplay = Class.create(BuildingDisplay, {
  
});
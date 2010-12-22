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
		this.owner = owner;
		this.img = Loader.images.buildings[owner.name+'.png'];
		var self = this;
		this.mapTiles =[];
		Object.extend(this.owner, this);
	},
	renderSprites : function(){
		this.sprite = new DomSprite(this.owner,this.img);
		this.sprite.render();
		this.owner.render();
	}
});

var TownhallDisplay = Class.create(BuildingDisplay, {
	
});

var MineDisplay = Class.create(BuildingDisplay, {
  
});

var QuarryDisplay = Class.create(BuildingDisplay, {
  
});
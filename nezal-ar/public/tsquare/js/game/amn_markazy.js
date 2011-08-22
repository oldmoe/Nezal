var AmnMarkazy = Class.create(Enemy,{
	
	hitting : false,
	hittingTime: 0,
	hitOffset: 10,
		
  initialize : function($super,scene,x,y){
     $super(scene,x,y) 
     this.hp = 30;
     this.maxHp = 30;
     this.power = 5;
  },
  
  tick : function($super){
    $super()
    if(this.scene.moving){
      if(this.scene.moveBack)this.coords.x+=this.scene.speed
      else this.coords.x-=this.scene.speed
    }
    this.checkCollision();
  },
  
  checkCollision: function(){
  	var crowdMembers = this.scene.crowdMembers[this.lane];
  	var length = crowdMembers.length; 
    return
  	for(var i=0; i<length; i++){
  		if(this.isCollide(crowdMembers[i])){
  			this.hitting = true;
  			if(this.hittingTime == 15)
				crowdMembers[i].takeHit(this.power);
			this.hittingTime += 1;	  			
  			this.hittingTime = this.hittingTime % 16;
  		}else{
  			this.hitting = false;
  			this.hittingTime = 0;
  		}
  	}
  },
  
  isCollide: function(obj){
  	var yDiff = Math.abs(this.coords.y-obj.coords.y);
  	if(yDiff < obj.imgHeight || yDiff < this.imgHeight){
  		var xDiff = Math.abs(this.coords.x-obj.coords.x);
  		if(xDiff < (obj.imgWidth) || xDiff < (this.imgWidth))
  			return true;
  	}
  	return false;	
  }
  
})

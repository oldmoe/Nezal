var Follower = Class.create(Unit,{
  water : 100,
  maxWater : 100,  
  enterSpeed : 3,
    
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y,options)
  	this.hp = 1;
  }
  
})

var RunningEnemy = Class.create(Enemy, {
	
  initialize : function($super,scene,x,y){
     $super(scene,x,y) 
  },
  
  tick: function($super){
  	$super();
  }
});
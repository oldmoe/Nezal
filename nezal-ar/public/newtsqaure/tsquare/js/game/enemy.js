var Enemy = Class.create(Unit, {
	
  initialize : function($super,scene,x,y, options){
     $super(scene,x,y, options) 
  },
  
  tick: function($super){
  	$super();
  }
});
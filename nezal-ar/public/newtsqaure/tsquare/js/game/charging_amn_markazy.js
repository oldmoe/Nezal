var ChargingAmnMarkazy = Class.create(AmnMarkazy,{
	
  speed: 15,	
		
  initialize : function($super,scene,x,y, options){
     $super(scene, x, y, options)
     this.speed = 5; 
  },
  
  updatePosition: function(){
    if(this.coords.x < this.scene.view.width)  
        this.move((this.scene.currentSpeed + this.speed) * this.scene.direction * -1, 0);
     else
        this.move((this.scene.currentSpeed) * this.scene.direction * -1, 0);   
  },
  
  setTarget: function($super, target){
      if(this.target == null && target != null){
         this.speed = 0;
         this.switchHoveringIcon();
      }
      $super(target);
  }
  
})

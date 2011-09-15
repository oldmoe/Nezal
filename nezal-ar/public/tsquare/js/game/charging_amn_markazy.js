var ChargingAmnMarkazy = Class.create(AmnMarkazy,{
	
  speed: 15,
  holdLevel: 1,	
		
  initialize : function($super,scene,x,y, options){
     $super(scene, x, y, options)
     this.type = "charging_amn_markazy";
     this.speed = 5; 
  },
  
  handleCollision: function(){
      if(this.target){
         if(this.hittingTime == 15){
            this.target.takeHit(this.power);
         }
         this.hittingTime += 1;              
         this.hittingTime = this.hittingTime % 16;
      }  
  },
  
  updatePosition: function(){
    if(this.coords.x < this.scene.view.width)  
        this.move((this.scene.currentSpeed + this.speed) * this.scene.direction * -1, 0);
     else
        this.move((this.scene.currentSpeed) * this.scene.direction * -1, 0);   
  }
  
})

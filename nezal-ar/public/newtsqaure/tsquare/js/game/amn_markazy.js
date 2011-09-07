var AmnMarkazy = Class.create(Enemy,{
	
	hitting : false,
	hittingTime: 0,
	hitOffset: 10,
	hittingTime: 0,
	
		
  initialize : function($super,scene,x,y, options){
     $super(scene,x,y, options) 
     this.hp = 30;
     this.maxHp = 30;
     this.power = 5;
     
  },
  
  tick : function($super){
    $super()
    this.coords.x -= this.scene.currentSpeed * this.scene.direction

      if(this.target){
         if(this.hittingTime == 15){
            this.target.takeHit(this.power);
         }
            
         this.hittingTime += 1;              
         this.hittingTime = this.hittingTime % 16;
      }  
    
  },
  
  setTarget: function(target){
      if(this.target != null && target == null){
          this.fire("normal")
      }
      
      if(this.target == null && target != null){
          this.fire("hit");
      }
        
      this.target = target;
  }
  
})

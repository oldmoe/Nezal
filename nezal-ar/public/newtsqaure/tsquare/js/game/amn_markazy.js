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
  },
  pickTarget : function(targets){
    var minDistance = 100000
    var minIndex = -1
    for(var i=0;i<targets.length;i++){
        var tmpDistance = Util.distance(this.coords.x,this.coords.y,targets[i].coords.x,targets[i].coords.y)
        if(tmpDistance < minDistance){
            minDistance = tmpDistance
            minIndex = i
        }
    }
    if(minIndex!=-1){
        if(this.target!=targets[minIndex] && minDistance < this.getWidth()) this.fire('hit')
        this.target = targets[minIndex]
    }
    else{
        this.target = null
        this.fire('normal')
    }  
  },
  
})

var Enemy = Class.create(Unit, {
  target : null,
  hp : 25, attack : 10 , defense : 25, chargeTolerance : 2, circleSize : 1,
  initialize : function($super,scene,x,y,options){
     $super(scene,x,y,options)
     this.mappingName = options.mappingName
     this.type = options.type 
     var specs = gameData.enemies[this.mappingName][this.type];
     for(var spec in specs){
         this[spec.dasherize().camelize()] = specs[spec] 
     }
     this.maxHp = this.hp
  },
  
  tick : function($super){
    $super()
    
    this.updatePosition();
    
    this.handleCollision();
  },
  
  handleCollision : function(){
      
  },
  updatePosition: function(){
    this.move(-1 * this.scene.currentSpeed * this.scene.direction, 0);  
  },
  setTarget: function(target){
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
    var targetChange = false
    if(minIndex!=-1 && minDistance <= this.getWidth()){
        if(this.target == null){
          this.target = targets[minIndex]
          this.fire('hit')
          targetChange = true
        }
        
        if(this.target != targets[minIndex]){
          this.target = targets[minIndex]
          targetChange = true
        }
    }else{
        if (this.target) {
            this.target = null
            this.fire('normal')
            targetChange = true
        }
    }
    return targetChange  
  },
  getHoveringIconState: function(){
      
  }

});
 

var Unit = Class.create({
  x:0,y:0,
  movementLength : 100,
  speed : 1,
  angle :0,
  moved : 0,
  moving : false,
  stateChanged : false,
  initialize : function(scene,x,y){
    this.coords ={x:x, y:y}
    this.scene = scene
  },
  tick : function(){  
    if(this.scene.moving)
      this.stateChanged = true
     else 
      this.stateChanged = false
  }
  
})

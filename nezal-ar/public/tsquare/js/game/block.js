var Block = Class.create(Unit,{
  initialize : function($super,scene,x,y){
     $super(scene,x,y) 
  },
  tick : function($super){
    $super()
    if(this.scene.moving)
    this.coords.x-=this.scene.speed
  }
})

var Npc = Class.create(Unit,{
  speed : 4, 
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y)
    this.direction = options.direction || 1
  },
  tick : function($super){
    $super()
    this.coords.x+=this.direction*this.speed
    this.stateChanged = true
  }
})

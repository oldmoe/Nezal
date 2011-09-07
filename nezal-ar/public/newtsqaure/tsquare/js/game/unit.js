var Unit = Class.create({
  x:0,y:0,
  speed : 1,
  angle :0,
  power: 10,
  hp : 30,
  maxHp : 30,
  stateChanged : false,
  kickedoutYShift : 0,
  maxkickedoutYShift : 57,
  kickedOutXShift : false,
  dead : false,
  movingToTarget : false,
  noDisplay : false,
  target: null,
  observer: null,
  handler: null,

  initialize : function(scene,x,lane, options){
    this.target = null
    this.observer = new Observer();
    this.scene = scene
    this.lane = lane
    var y = this.scene.view.laneMiddle*2*this.lane+this.scene.view.laneMiddle
    this.coords ={x:x, y:y}
    this.handler = options.handler
  },
  
  tick : function(){ 
    if(this.dead)return
  },

    observe: function(event, callback){
        this.observer.addObserver(event, callback);
    },
    
    fire: function(event){
        this.observer.fire(event);
    },

  getMovingState : function(){
    if(this.scene.running)return "run"
    return "normal"
  },
  
  getReverseState : function(){
    if(this.scene.running)return "reverseRun"
    return "reverse"
  },
  
  takeHit : function(power){
    this.hp-= power;
    if(this.hp <=0){
        this.handler.removeObject(this, this.lane);
    }   
  },
  
  move : function(dx,dy){
    this.coords.x+=dx
    this.coords.y+=dy
  },
  
  startKickingOut : function(){
    this.kickedout = true
  },
  
  kickout : function(){
    if(this.coords.x < 0) this.dead = true
    if(this.kickedoutYShift < this.maxkickedoutYShift ){
      this.move(0,-3)
      this.kickedoutYShift+=3
    }else{
      if (!this.kickedOutXShift) {
        this.shake = true
        this.kickedOutXShift = true
      }
      else {
        this.move(-3, 0)
      }
    }
  },
  
  moveToTarget : function(target){
   this.movingToTarget = true
   this.target = target
  },
  
  getCoods : function(){
    return {x: this.coords.x+this.scene.x}
  },
  
  setTarget: function(target){
      this.target = target;
  },
  
  collidesWith: function(target){
      if (this.coords.x + this.getWidth() > target.coords.x)
         return true; 
      return false;  
  }
  
})

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
  movingSpeed : 8,
  noDisplay : false,
  target: null,
  observer: null,
  handler: null,
  movingToTarget : false,
  initialize : function(scene,x,lane, options){
    var self = this
    this.commandFilters = [
      {command: function(){return self.movingToTarget}, callback: function(){self.moveToTarget()}}
    ];
    this.target = null
    this.observer = new Observer();
    this.scene = scene
    this.lane = lane
    var y = this.scene.view.laneMiddle*2*this.lane+this.scene.view.laneMiddle
    this.coords ={x:x, y:y}
    this.handler = options.handler
  },
  processCommand: function(){
    for(var i=0;i<this.commandFilters.length;i++){
        if(this.commandFilters[i].command()){
            if(!this.commandFilters[i].callback()) break;
        }    
    }
  },
  tick : function(){
    if(this.dead)return
    this.processCommand()
  },
  moveToTarget : function(){
    if(Math.abs(this.target.x - this.coords.x) > this.enterSpeed || Math.abs(this.target.y - this.coords.y) > this.movingSpeed){
          var move = Util.getNextMove(this.coords.x, this.coords.y , this.target.x, this.target.y, this.movingSpeed)
          this.coords.x+=move[0]
          this.coords.y+=move[1]
      }
      else this.movingToTarget = false  
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
    if(minIndex!=-1 && this.target!=targets[minIndex] && minDistance < this.getWidth()){
        this.target = targets[minIndex]
    }  
  },
  getCoods : function(){
    return {x: this.coords.x+this.scene.x}
  },
  
  setTarget: function(target){
      if (!this.target && target) {
          this.target = target;
      }
  },
  getSize : function(){
    return 1  
  },
  collidesWith: function(target){
      if (this.coords.x + this.getWidth() > target.coords.x)
         return true; 
      return false;  
  }
  
})

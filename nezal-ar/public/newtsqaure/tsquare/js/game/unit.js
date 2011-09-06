var Unit = Class.create({
  x:0,y:0,
  speed : 1,
  angle :0,
  power: 10,
  hp : 30,
  maxHp : 30,
  stateChanged : false,
  rotating : false,
  rotationSpeed : 6,
  kickedoutYShift : 0,
  maxkickedoutYShift : 57,
  kickedOutXShift : false,
  dead : false,
  enterSpeed : 3,
  movingToTarget : false,
  noDisplay : false,
  rotationPoints : null,
  target: null,
  observer: null,

  initialize : function(scene,x,lane){
    this.rotationPoints = []
    this.target = null
    this.observer = new Observer();
    this.scene = scene
    this.lane = lane
    var y = this.scene.view.laneMiddle*2*this.lane+this.scene.view.laneMiddle
    this.coords ={x:x, y:y}
  },
  
  tick : function(){ 
    if(this.dead)return
     
/*    
    if(this.kickedout) this.kickout()   
    if(this.rotating){
        this.rotationMove()
    }else if(this.movingToTarget){
      // if(this.target.coords.x - this.enterSpeed > this.coords.x) this.coords.x+=this.enterSpeed
      // else this.movingToTarget = false
    }
    if(this.scene.moving || this.rotating || this.kickedout || this.movingToTarget)
      this.stateChanged = true
    else 
      this.stateChanged = false
*/

  },

    observe: function(event, callback){
        this.observer.addObserver(event, callback);
    },
    
    fire: function(event){
        this.observer.fire(event);
    },
   
  rotate : function(target){
    this.addRotationPoints(target)
    this.rotating = true   
    this.target = target
    this.fire(this.rotationPoints[0].state)
  },
  
  addRotationPoints : function(target){
    this.rotationPoints.push({
      values: {
        x: target.coords.x - this.getWidth() / 2 - target.getHeight()/4,
        y: target.coords.y + target.getHeight() / 2 - 20
      },
      state: "front"
    })
    this.rotationPoints.push({
      values: {
        x: target.coords.x + target.getWidth() - this.getWidth() / 2 - target.getHeight()/4,
        y: target.coords.y + target.getHeight() / 2 - 20
      },
      state : this.getMovingState()
    })
    this.rotationPoints.push({
      values: {
        x: target.coords.x + target.getWidth() - this.getWidth() / 2,
        y: target.coords.y - 20
      },
      state : "back"
    })
    this.rotationPoints.push({
      values: {
        x: target.coords.x - this.getWidth() / 2,
        y: target.coords.y - 20
      },
      state : "reverse"
    })
  },
  getMovingState : function(){
    if(this.scene.running)return "run"
    return "normal"
  },
  
  getReverseState : function(){
    if(this.scene.running)return "reverseRun"
    return "reverse"
  },
  
  resetRotation : function(){
    this.target = null
    this.rotating = false
    this.scene.moving = false
    this.scene.rotating = false
    this.fire("normal")
  },
  
  rotationMove : function(){
    if (!this.target|| this.target.hp <= 0) {
      this.resetRotation()
    }
    if(this.scene.rotating){
      if (this.rotationPoints.length == 0) {
        this.target.takeHit(this.power)
        if (this.target.hp < 0) {
          this.resetRotation()
          return
        }else{
          this.rotate(this.target)
        }
      }
      var rp = this.rotationPoints[0]
      var move = Util.getNextMove(this.coords.x,this.coords.y,rp.values.x,rp.values.y,this.scene.speed)
      this.coords.x+=move[0]
      this.coords.y+=move[1]
      if (this.coords.x <= rp.values.x + 0.001 && this.coords.x >= rp.values.x - 0.001 &&
      this.coords.y <= rp.values.y + 0.001 &&this.coords.y >= rp.values.y - 0.001) {
        this.rotationPoints.shift()
        if(this.rotationPoints.length > 0 ) this.fire(this.rotationPoints[0].state)
      }
    }else{
      this.rotating = false
    }
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
  }
  
})

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
  observers : null,  
  initialize : function(scene,x,lane){
    this.observers = {}
    this.rotationPoints = []
    this.target = null
    this.scene = scene
    this.lane = lane
    var y = this.scene.laneMiddle*2*this.lane+this.scene.laneMiddle
    this.coords ={x:x, y:y}
  },
  
  tick : function(){ 
    if(this.dead)return 
    if(this.kickedout) this.kickout() 
    if(this.rotating){
        this.rotationMove()
    }else if(this.movingToTarget){
      if(this.target.x - this.enterSpeed > this.coords.x) this.coords.x+=this.enterSpeed
      else if(this.target.x + this.enterSpeed < this.coords.x) this.coords.x-=this.enterSpeed
      else this.movingToTarget = false
    }
    if(this.scene.moving || this.rotating || this.kickedout || this.movingToTarget)
      this.stateChanged = true
    else 
      this.stateChanged = false
  },
  
  rotate : function(target){
    this.addRotationPoints(target)
    this.rotating = true   
    this.target = target
    this.setState(this.rotationPoints[0].state)
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
      state :"normal"
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
  resetRotation : function(){
    this.target = null
    this.rotating = false
    this.scene.moving = false
    this.scene.rotating = false
    this.setState("normal")
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
        if(this.rotationPoints.length > 0 ) this.setState(this.rotationPoints[0].state)
      }
    }else{
      this.rotating = false
    }
  },
  takeHit : function(power){
    this.hp-= power
    if(this.hp <=0){
      if(this.scene.obstacles[this.lane].indexOf(this)!=-1)this.scene.obstacles[this.lane].remove(this)
      this.destroy()
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
  setState : function(state){
    if(this.observers[state]){
      for(var i=0;i<this.observers[state].length;i++){
        this.observers[state][i]()
      }
    }
  },
  addObserver : function(state,func){
    if(!this.observers[state])this.observers[state] = []
    this.observers[state].push(func)
  }
})
var Unit = Class.create({
  x:0,y:0,
  speed : 1,
  angle :0,
  power: 10,
  stateChanged : false,
  rotating : false,
  rotationSpeed : 6,
  directionsCovered : 0,
  kickedoutYShift : 0,
  maxkickedoutYShift : 57,
  kickedOutXShift : false,
  dead : false,
  enterSpeed : 3,
  movingToTarget : false,
  noDisplay : false,
  rotationPoints : null,
  initialize : function(scene,x,lane){
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
    this.direction = DIRECTIONS.D
    this.directionsCovered = 0
    this.rotating = true   
    this.rotationRandomDistance = this.createRandomRotationDistance()
    this.target = target
    this.direction = DIRECTIONS.D 
  },
  addRotationPoints : function(target){
    this.rotationPoints.push({x:target.coords.x - this.getWidth()/2,y:target.coords.y+target.getHeight()/2})
    this.rotationPoints.push({x:target.coords.x + target.getWidth() - this.getWidth()/2,y:target.coords.y+target.getHeight()/2})
    this.rotationPoints.push({x:target.coords.x + target.getWidth() - this.getWidth()/2,y:target.coords.y-target.getHeight()/2})
    this.rotationPoints.push({x:target.coords.x - this.getWidth()/2,y:target.coords.y -target.getHeight()/2})
    this.rotationPoints.push({x:target.coords.x - this.getWidth()/2,y:target.coords.y})
//    for(var i=0;i<5;i++){
//      var div = document.createElement('div')
//      div.addClassName('DomSprite')
//      div.style.top = this.rotationPoints[i].y + 200 + "px"
//      div.style.left = this.rotationPoints[i].x + "px"
//      div.style.backgroundColor = "black"
//      div.style.width = "5px"
//      div.style.height = "5px"
//      $('gameCanvas').appendChild(div)
//    }
  },
  createRandomRotationDistance : function(){
    return Math.random()*20
  },
  
  rotationMove : function(){
    if(this.scene.rotating){
      if (this.rotationPoints.length == 0) {
        this.target.takeHit(this.power)
        if (this.target.hp < 0) {
          this.target = null
          this.rotating = false
          this.scene.moving = true
          this.scene.rotating = false
          return
        }else{
          this.rotate(this.target)
        }
      }
      var move = Util.getNextMove(this.coords.x,this.coords.y,this.rotationPoints[0].x,this.rotationPoints[0].y,this.scene.speed)
      this.coords.x+=move[0]
      this.coords.y+=move[1]
      if(this.coords.x <= this.rotationPoints[0].x + 0.001 && this.coords.x >= this.rotationPoints[0].x - 0.001
      &&this.coords.y <= this.rotationPoints[0].y + 0.001 && this.coords.y >= this.rotationPoints[0].y - 0.001)
      this.rotationPoints.shift()
    }
  },
//  rotationMove : function(){
//    if(this.direction == DIRECTIONS.D){
//      this.move(0,this.rotationSpeed)
//      if (this.directionsCovered == 0) {
//        if (this.coords.y  > this.target.coords.y + this.target.getHeight()/2) {
//          this.direction = DIRECTIONS.R
//          this.directionsCovered++
//          this.rotationRandomDistance = this.createRandomRotationDistance()
//        }
//      }else{
//        if (this.coords.y - this.rotationRandomDistance > this.target.coords.y) {
//          this.direction = DIRECTIONS.R
//          this.directionsCovered++
//          this.rotationRandomDistance = this.createRandomRotationDistance()
//        }
//      }
//    }else if(this.direction == DIRECTIONS.R){
//      this.move(this.rotationSpeed,0)
//      if(this.coords.x + 2*this.rotationRandomDistance > this.target.coords.x + this.target.getWidth()){
//        this.direction = DIRECTIONS.U
//        this.directionsCovered++
//        this.rotationRandomDistance = this.createRandomRotationDistance()
//      }
//    }else if(this.direction == DIRECTIONS.U){
//      this.move(0,-this.rotationSpeed)
//      if(this.coords.y + 3*this.rotationRandomDistance < this.target.coords.y  ){
//        this.direction = DIRECTIONS.L
//        this.directionsCovered++
//        this.rotationRandomDistance = this.createRandomRotationDistance()
//      }
//    }else if(this.direction == DIRECTIONS.L){
//      if(this.coords.x + this.getWidth() - 2*this.rotationRandomDistance < this.target.coords.x){
//        this.direction = DIRECTIONS.D
//        this.directionsCovered++
//        this.rotationRandomDistance = this.createRandomRotationDistance()
//      }
//      this.move(-this.rotationSpeed,0)
//    }
//    if(this.directionsCovered == 5){
//        this.rotating = false
//        this.target.takeHit(this.power)
//        return
//    }
//  },
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
})
var DIRECTIONS =  {U:0,D: 1, L : 2, R : 3}
var Unit = Class.create({
  x:0,y:0,
  speed : 1,
  angle :0,
  stateChanged : false,
  rotating : false,
  rotationSpeed : 3,
  directionsCovered : 0,
  kickedoutYShift : 0,
  maxkickedoutYShift : 57,
  kickedOutXShift : false,
  dead : false,
  initialize : function(scene,x,y){
    this.coords ={x:x, y:y}
    this.scene = scene
  },
  
  tick : function(){ 
    if(this.dead)return 
    if(this.kickedout) this.kickout() 
    if(this.rotating){
        this.rotationMove()
    }
    if(this.scene.moving || this.rotating || this.kickedout)
      this.stateChanged = true
    else 
      this.stateChanged = false
  },
  
  rotate : function(target){
    this.direction = DIRECTIONS.D
    this.directionsCovered = 0
    this.rotating = true   
    this.rotationRandomDistance = this.createRandomRotationDistance()
    this.target = target
    this.direction = DIRECTIONS.D 
  },
  
  createRandomRotationDistance : function(){
    return Math.random()*50
  },
  
  rotationMove : function(){
    if(this.direction == DIRECTIONS.D){
      this.move(0,this.rotationSpeed)
      if (this.directionsCovered == 0) {
        if (this.coords.y - this.rotationRandomDistance + this.imgHeight/4 > this.target.coords.y + this.target.imgHeight/2) {
          this.direction = DIRECTIONS.R
          this.directionsCovered++
          this.rotationRandomDistance = this.createRandomRotationDistance()
        }
      }else{
        if (this.coords.y - this.rotationRandomDistance > this.target.coords.y) {
          this.direction = DIRECTIONS.R
          this.directionsCovered++
          this.rotationRandomDistance = this.createRandomRotationDistance()
        }
      }
    }else if(this.direction == DIRECTIONS.R){
      this.move(this.rotationSpeed,0)
      if(this.coords.x - 2*this.rotationRandomDistance > this.target.coords.x + this.target.imgWidth/2){
        this.direction = DIRECTIONS.U
        this.directionsCovered++
        this.rotationRandomDistance = this.createRandomRotationDistance()
      }
    }else if(this.direction == DIRECTIONS.U){
      this.move(0,-this.rotationSpeed)
      if(this.coords.y + this.rotationRandomDistance < this.target.coords.y - this.target.imgWidth/2){
        this.direction = DIRECTIONS.L
        this.directionsCovered++
        this.rotationRandomDistance = this.createRandomRotationDistance()
      }
    }else if(this.direction == DIRECTIONS.L){
      if(this.coords.x + 3*this.rotationRandomDistance < this.target.coords.x){
        this.direction = DIRECTIONS.D
        this.directionsCovered++
        this.rotationRandomDistance = this.createRandomRotationDistance()
      }
      this.move(-this.rotationSpeed,0)
    }
    if(this.directionsCovered == 5){
        this.rotating = false
        return
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
  }
})
var DIRECTIONS =  {U:0,D: 1, L : 2, R : 3}
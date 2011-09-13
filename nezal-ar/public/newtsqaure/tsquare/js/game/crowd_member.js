var CrowdMember = Class.create(Unit,{
  
  xShift : 100,
  water : 7000,
  maxWater : 700,
  randomDx : 0,
  randomDy : 0,
  waterDecreaseRate : 0.5,
  holdingPoint: null,
  commandFilters: [],
  rotationPoints : null,
  rotationSpeed : 5,
  rotating : false,
  pushing : false,
  pushDirections : {forward:0,backward:1},
  pushDirection : 0,
  maxPushDisplacement : 50,
  extraSpeed : 0,
  moved : 0,
  
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y, options)
    this.type = "crowd_member";
    this.rotationPoints = []
    
    var self = this
    this.commandFilters.push({command: function(){return self.rotating}, callback: function(){self.circleMove()}})
    this.commandFilters.push({command:function(){return self.pushing}, callback: function(){self.pushMove()}})  
      
    this.hp = 1000;
    this.maxHp = 1000;
          
    x = x + this.xShift
    this.originalPosition = {x:0,y:0}
    
    this.originalPosition.y = this.handler.initialPositions[y].y - this.handler.crowdMembersPerColumn * 10
    this.originalPosition.x = this.handler.initialPositions[y].x + 10*this.handler.crowdMembersPerColumn
    this.handler.crowdMembersPerColumn-- 
    if(this.handler.crowdMembersPerColumn == -1){
      this.handler.crowdMembersPerColumn = 2
      this.handler.initialPositions[y].x-=30
    }
    this.randomDx = Math.round(Math.random()*50)
    this.coords.x +=this.randomDx
    this.randomDy = Math.round(Math.random()*30)
    this.coords.y+= this.randomDy
    if(options && options.level) this.level = options.level
    else this.level = 4
    this.followers = []
    //this.createFollowers()
  },
  
  createFollower : function(){
      if(this.followers.length >= this.level)return
      var x = this.coords.x - Math.floor(((this.followers.length/4)+1)*15 * Math.random())
      var randomOffset = Math.round(50 * Math.random()) - 25
      var y = this.coords.y + randomOffset
      var follower = this.scene.addObject({name:"follower", x:this.scene.xPos - 30, y:this.lane})
      follower.coords.y+=randomOffset
      this.scene.push(follower)
      this.followers.push(follower)
      follower.moveToTarget({x:x,y:y})
  },
  
  createFollowers : function(){
    for(var i=0;i<this.noOfFollowers;i++){
      var x = this.coords.x - parseInt(this.noOfFollowers*15 * Math.random())
      var y = this.coords.y + parseInt(50 * Math.random()) - 25
      var follower = this.scene.addObject({name:"follower", x:x, y:y})
      this.scene.push(follower)
      this.followers.push(follower)
    }
  },
  
  tick : function($super){
    $super()
    this.stateChanged = true
    this.water-=this.waterDecreaseRate
    if(this.water <= 0) this.dead = true    
  },
  
  tickFollowers : function(move){
     for(var i=0;i<this.followers.length;i++){
        this.followers[i].coords.x+=move[0]
        this.followers[i].coords.y+=move[1]
        this.followers[i].water -=this.waterDecreaseRate
        if(this.followers[i].water <=0){
          this.followers[i].destroy()
          this.followers.splice(i,1)
        }
      }
  },
 
  rotate : function($super,target){
    $super(target)
    for(var i=0;i<this.followers.length;i++){
      this.followers[i].rotate(target)
    }
  },
  
  takeHit: function($super, power){
    if(this.followers.length > 0)
        this.followers[0].takeHit(power);
    else
        $super(power)   
  },
  
  circle : function(){
      if(this.target){
          this.currentAction = "circle";
          this.rotating = true 
          this.addRotationPoints(this.target)
          this.fire(this.rotationPoints[0].state)
      }else{
         console.log("invalid command"); 
      }
  },
  
  retreat : function(){
      this.currentAction = "retreat"
  },
  
  march : function(){
      this.currentAction = "march"
  },
  
  hold : function(){
      this.currentAction = "hold"
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
  
  pushMove : function(){
    if(!this.target || this.target.getSize() == 1){
      this.pushing = false  
      return
    } 
    var displacement = 0
    if(this.pushDirection == this.pushDirections.forward)displacement = this.scene.currentSpeed +this.moved*0.1
    else displacement = -1 *(this.scene.currentSpeed + (this.maxPushDisplacement-this.moved)*0.1)
    this.moved+= Math.abs(displacement)
    this.move(displacement,0)
    var directionDone = false
    if(this.coords.x + this.getWidth()/2 > this.target.coords.x && this.pushDirection == this.pushDirections.forward){
        directionDone = true
        this.target.takePush()
        if(this.target.pushes==0){
            this.target = null
            this.pushing = false
        }
    }else if(this.moved > this.maxPushDisplacement){
        directionDone = true
    } 
    if(directionDone){
        this.moved = 0
        this.reverse = true
        this.pushDirection = 1 - this.pushDirection
    }        
  },
  
  circleMove : function(){
    if (!this.target|| this.target.hp <= 0 || this.target.dead) {
      this.resetRotation()
    }
      if (this.rotationPoints.length == 0) {
        this.target.takeHit(this.power)
        if (this.target.hp < 0) {
          console.log('reset 2')
          this.resetRotation()
          return
        }else{
          this.circle(this.target)
        }
      }
      var rp = this.rotationPoints[0]
      var move = Util.getNextMove(this.coords.x,this.coords.y,rp.values.x,rp.values.y,this.rotationSpeed)
      this.coords.x+=move[0]
      this.coords.y+=move[1]
      if (this.coords.x <= rp.values.x + 0.001 && this.coords.x >= rp.values.x - 0.001 &&
      this.coords.y <= rp.values.y + 0.001 &&this.coords.y >= rp.values.y - 0.001) {
          this.rotationPoints.shift()
          if(this.rotationPoints.length > 0 ) this.fire(this.rotationPoints[0].state)
      }
  },
  
  setTarget: function($super,target){
    $super(target)
    if(target && target.getSize() > 1){
        this.pushing = true        
    }  
  },
  
  resetRotation : function(){
    this.target = null
    this.rotating = false
    this.scene.moving = false
    this.scene.rotating = false
    this.fire("normal")
  }  
 
})
  

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
  
  
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y, options)
    
    this.rotationPoints = []
    
    var self = this
    this.commandFilters = [
      {command: function(){return self.rotating}, callback: function(){self.circleMove()}}
    ];
      
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
     this.processCommand()
    this.stateChanged = true
    this.water-=this.waterDecreaseRate
    if(this.water <= 0) this.dead = true

/*    
    if(this.scene.holding && this.movingToTarget){
      var move = Util.getNextMove(this.coords.x,this.coords.y,this.holdingPoint.x,this.holdingPoint.y,this.scene.speed)

       if(Math.abs(move[0]) < 2 && Math.abs(move[1]) < 2){
         this.movingToTarget = false;  
       }  
      this.move(move[0], move[1])  
      this.tickFollowers(move)
    }
       
    if(!this.scene.moving)return
    if(this.coords.x !=this.originalPosition.x || this.coords.y !=this.originalPosition.y ){
      var move = Util.getNextMove(this.coords.x,this.coords.y,this.originalPosition.x,this.originalPosition.y,this.scene.speed)
      this.coords.x+=move[0]
      this.coords.y+=move[1]
      this.tickFollowers(move)
    }
*/    
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
  
  processCommand: function(){
    for(var i=0;i<this.commandFilters.length;i++){
        if(this.commandFilters[i].command()){
            if(!this.commandFilters[i].callback()) break;
        }    
    }
  },
  
  setMovingTarget: function(targetPoint){
    this.movingToTarget = true;
    this.holdingPoint = targetPoint;
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
      console.log("march1");
  },
  
  hold : function(){
      this.currentAction = "hold"
      console.log("hold");
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
  circleMove : function(){
    console.log('circle')
    if (!this.target|| this.target.hp <= 0) {
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
  resetRotation : function(){
    this.target = null
    this.rotating = false
    this.scene.moving = false
    this.scene.rotating = false
    this.fire("normal")
  },
 
})
  
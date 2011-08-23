var CrowdMember = Class.create(Unit,{
  xShift : 100,
  water : 700,
  maxWater : 700,
  randomDx : 0,
  randomDy : 0,
  waterDecreaseRate : 0.5,
  initialize : function($super,scene,x,y,options){
	  this.hp = 30;
	  this.maxHp = 30;
    x = x + this.xShift
    this.originalPosition = {x:0,y:0}
    $super(scene,x,y)
    this.originalPosition.y = this.scene.crowdMemberInitialY - this.scene.numberOfCrowdMembersPerColumn * 10
    this.originalPosition.x = this.scene.crowdMemberInitialX
    if(this.scene.numberOfCrowdMembersPerColumn % 2 == 0){
      this.originalPosition.x = this.scene.crowdMemberInitialX -=20  
    }
    this.scene.numberOfCrowdMembersPerColumn-- 
    if(this.scene.numberOfCrowdMembersPerColumn == -1){
      this.scene.numberOfCrowdMembersPerColumn = 2
      this.scene.crowdMemberInitialX-=30
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
    //this.water-=this.waterDecreaseRate
    if(this.water <= 0) this.dead = true   
    if(!this.scene.moving)return
    if(this.coords.x !=this.originalPosition.x || this.coords.y !=this.originalPosition.y ){
      var move = Util.getNextMove(this.coords.x,this.coords.y,this.originalPosition.x,this.originalPosition.y,this.scene.speed)
      this.coords.x+=move[0]
      this.coords.y+=move[1]
      this.tickFollowers(move)
    }
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
  	console.log("takehit")
  	if(this.followers.length > 0)
  		this.followers[0].takeHit(power);
  	else
  		$super(power)	
  }
})
  

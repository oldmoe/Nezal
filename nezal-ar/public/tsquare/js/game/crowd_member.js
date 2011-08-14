var CrowdMember = Class.create(Unit,{
  xShift : 100,
  hp : 300,
  maxHp : 300,
  water : 300,
  maxWater : 300,
  initialize : function($super,scene,x,y,options){
    x = x + this.xShift
    $super(scene,x,y)
    if(options && options.level) this.level = options.level
    else this.level = 4
    this.followers = []
    //this.createFollowers()
  },
  createFollower : function(){
      if(this.followers.length >= this.level)return
      var x = this.coords.x - Math.floor(((this.followers.length/4)+1)*15 * Math.random())
      var y = this.coords.y + parseInt(50 * Math.random()) - 25
      var follower = this.scene.addObject({name:"follower", x:this.scene.xPos - 30, y:y})
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
    if(!this.scene.moving)return
    if(this.coords.x > this.xShift){
      this.coords.x -=this.scene.speed
      for(var i=0;i<this.followers.length;i++){
        this.followers[i].coords.x-=this.scene.speed
      }
    }
  },
  rotate : function($super,target){
    $super(target)
    for(var i=0;i<this.followers.length;i++){
      this.followers[i].rotate(target)
    }
  }
})
  

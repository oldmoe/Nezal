var CrowdMember = Class.create(Unit,{
  noOfFollowers : 5,
  xShift : 100,
  hp : 30,
  maxHp : 30,
  hydra : 30,
  maxHydra : 30,
  initialize : function($super,scene,x,y){
    x = x + this.xShift
    $super(scene,x,y)
    this.followers = []
    this.createFollowers()
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
  

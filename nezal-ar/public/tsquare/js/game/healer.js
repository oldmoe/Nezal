var Healer = Class.create(CrowdMember,{
  rate : 30,
  healAmount : 10,
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y)
    if(options && options.rate)this.rate = options.rate
  },
  tick : function($super){
    $super()
    if(this.scene.reactor.ticks % this.rate!=0)return 
    var minHp = 1000000
    var minLane = -1
    var minIndex = -1
    for(var i=0;i< this.scene.crowdMembers.length;i++){
      for(var j=0;j<this.scene.crowdMembers[i].length;j++){
        if(this.scene.crowdMembers[i][j].hp < minHp){
          minHp = this.scene.crowdMembers[i][j].hp
          minLane = i
          minIndex = j
        }
      }
    }
    if(minLane!=-1){
      var crowd = this.scene.crowdMembers[minLane][minIndex] 
      crowd.hp = Math.min(crowd.hp+this.healAmount, crowd.maxHp)
    }
  }
})

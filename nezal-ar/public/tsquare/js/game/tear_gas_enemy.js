var TearGasEnemy = Class.create(Enemy,{
  rate : 4, 
  hitting : false,
  initialize : function($super,scene,x,y, options){
     $super(scene,x,y, options) 
     this.hp = 30;
     this.maxHp = 30;
     this.power = 10;
     this.hit() 
  },
  hit : function(){
      if(this.hp <=0)return
      var self = this
      this.scene.reactor.push(this.scene.reactor.everySeconds(this.rate),function(){
          self.fire("hit");
          self.createTearGasBomb()
      })
  },
  createTearGasBomb : function(){
      
  }
  
})

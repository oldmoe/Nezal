var Block = Class.create(Unit,{
    //params contains x,y(initial @x, @y of the block) and @rows,@columns which are the dimensions of the block
    //params also contain elememnts which are the objects in the block
    elements: null,
    elementWidth : 30,
    elementHeight : 18,
    noDisplay : true,
    initialize : function($super,scene,x,y,options){
      this.elements = []
      $super(scene,x,y)
      this.objectType = options.obj
      this.addElementsToBlock(options)
      
    },
    tick : function(){
      for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < this.elements[0].length; j++) {
          this.elements[i][j].tick()
        }
      }
      if(this.scene.moving){
        if(this.scene.moveBack)this.coords.x+=this.scene.speed 
        else this.coords.x-=this.scene.speed
      }
    },
    addElementsToBlock : function(options){
      var counter = 0
      var blockObjectKlass = eval(options.obj.formClassName())
      for(var i=0;i<options.rows;i++){
        this.elements[i] = []
        for (var j = 0; j < options.columns; j++) {
            this.elements[i][j] = new blockObjectKlass(this.scene,0,0)
            var randomY = Math.round(Math.random()*12) - 6
            var randomX = Math.round(Math.random()*12) - 6
            this.elements[i][j].coords.x = this.coords.x + this.elementWidth * i - 20*j + randomX
            this.elements[i][j].coords.y = this.coords.y + this.elementHeight * j + randomY
        }
      }
    },
    
    getWidth : function(){
      if(!this.elements[0])return 0
      return this.elementWidth * this.elements.length + (this.elements[0][0].imgWidth - this.elementWidth)  
    },
    
    getHeight : function(){
      if(!this.elements[0])return 0
      return this.elementHeight * this.elements.length + (this.elements[0][0].imgHeight - this.elementHeight)
    },
    
    takeHit : function(power){
      var maxHp = 0
      for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < this.elements[i].length; j++) {
          this.elements[i][j].takeHit(power)
          maxHp = Math.max(this.elements[i][j].hp,maxHp ) 
          if (this.elements[i][j].hp <= 0) {
            this.elements[i].remove(this.elements[i][j])
            j--
          }
        }
      }
      if(maxHp<= 0 && this.scene.obstacles[this.lane].indexOf(this)!=-1 ){
        this.scene.obstacles[this.lane].remove(this)
      }
    }
    
})

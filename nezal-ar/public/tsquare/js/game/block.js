var Block = Class.create(Enemy,{
    //params contains x,y(initial @x, @y of the block) and @rows,@columns which are the dimensions of the block
    //params also contain elememnts which are the objects in the block
    elements: null,
    elementWidth : 60,
    elementHeight : 15,
    noDisplay : true,
    
    initialize : function($super,scene,x,y,options){
      this.type = "block";
      this.elements = []
      $super(scene,x,y,options)
      if (options && options.obj) {
          this.objectType = options.obj
          this.addElementsToBlock(options)
      }
      this.options = options
    },
    
    
    addElementsToBlock : function(options){
      var counter = 0
      var blockObjectKlass = eval(options.obj.formClassName())
      for(var i=0;i<options.rows;i++){
        this.elements[i] = []
        options.type = "1_1"
        for (var j = 0; j < options.columns; j++) {
            this.elements[i][j] = new blockObjectKlass(this.scene,0,this.lane,options)
            var randomY = Math.round(Math.random()*8) - 4
            var randomX = Math.round(Math.random()*8) - 4
            this.elements[i][j].coords.x = this.coords.x + this.elementWidth * i - 10*j
            this.elements[i][j].coords.y = this.coords.y + this.elementHeight * (j-1)
            this.elements[i][j].showHoveringIcon = false;
        }
      }
    },
    
    getWidth : function(){
      if(!this.elements[0] || !this.elements[0][0])return 0
      return this.elementWidth * this.elements.length + (this.elements[0][0].imgWidth - this.elementWidth)  
    },
    
    getHeight : function(){
      if(!this.elements[0]  || !this.elements[0][0])return 0
      return this.elementHeight * this.elements.length + (this.elements[0][0].imgHeight - this.elementHeight)
    },
    
    takeHit : function(power){
      var maxHp = 0
      for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < this.elements[i].length; j++) {
          this.elements[i][j].takeHit(power)
          maxHp = Math.max(this.elements[i][j].hp,maxHp ) 
          if (this.elements[i][j].hp <= 0) {
            this.elements[i][j].destroy()
            this.elements[i].remove(this.elements[i][j])
            j--
          }
        }
      }
      if(maxHp<= 0 && this.handler.objects[this.lane].indexOf(this)!=-1 ){
        this.dead = true
        this.handler.objects[this.lane].remove(this)
      }
    },
    
    getSize : function(){
      return this.elements.length * this.elements[0].length  
    }, 
    
    split : function(){
      if(this.elements.length == 1)return
      console.log("split");
//        if(this.elements.length == 1){
//            for(var i=0;i<this.elements[0].length;i++){
//                this.handler.objects[this.lane].pushFirst(this.elements[0][i])
//                this.elements[0][i].moveToTarget({x:this.coords.x+i*100 + this.getWidth()/2,y:this.elements[0][i].coords.y})
//            }
//        }else 
         if(this.elements.length == 3){
            var options = this.options
            options.type = "3_1" 
            this.setTarget(null)
            var b1 = new Block(this.scene,this.elements[0][0].coords.x ,1, options)
            b1.coords.y = this.coords.y
            b1.elements = [this.elements[0]]
            var b2 = new Block(this.scene,this.elements[1][0].coords.x  ,1,options)
            b2.elements = [this.elements[1]]
            b2.coords.y = this.coords.y
            var b3 = new Block(this.scene,this.elements[2][1].coords.x,1,options)
            b3.elements = [this.elements[2]]
            b3.coords.y = this.coords.y
            b1.moveToTarget({x:this.coords.x + 100,y:this.coords.y})
            b2.moveToTarget({x:this.coords.x + 250,y:this.coords.y})
            b3.moveToTarget({x:this.coords.x + 400,y:this.coords.y})
            this.handler.objects[this.lane].pushFirst(b3)
            this.handler.objects[this.lane].pushFirst(b2)
            this.handler.objects[this.lane].pushFirst(b1)
        }
        this.handler.objects[this.lane].remove(this)
    },
    setElements : function(elements){
        this.elements = elements
    },
    
    setTarget : function(target){
      for(var i=0;i<this.elements.length;i++){
          for(var j=0;j<this.elements[i].length;j++){
              this.elements[i][j].setTarget(target)
          }
      }  
    },
    
    pickTarget : function(targets){
        for (var i = 0; i < this.elements.length; i++) {
            for (var j = 0; j < this.elements[i].length; j++) {
                this.elements[i][j].pickTarget(targets)
            }
        }
    },
    move : function(dx,dy){
        this.coords.x+=dx
        this.coords.y+=dy
        this.moveElements(dx,dy)
    },    
    takePush : function(){
       this.chargeTolerance--
       if(this.chargeTolerance == 0) this.split()
    },
    
    moveElements : function(dx,dy){
        for (var i = 0; i < this.elements.length; i++) {
            for (var j = 0; j < this.elements[i].length; j++) {
                this.elements[i][j].move(dx,dy)
            }
        }
    },    
})

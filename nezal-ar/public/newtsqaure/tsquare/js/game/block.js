var Block = Class.create(Unit,{
    //params contains x,y(initial @x, @y of the block) and @rows,@columns which are the dimensions of the block
    //params also contain elememnts which are the objects in the block
    elements: null,
    elementWidth : 25,
    elementHeight : 23,
    noDisplay : true,
    pushes : 2,
    type : "block",
    
    initialize : function($super,scene,x,y,options){
      this.elements = []
      $super(scene,x,y,options)
      if (options && options.obj) {
          this.objectType = options.obj
          this.addElementsToBlock(options)
      }
    },
    
    tick : function(){
      for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < this.elements[0].length; j++) {
          this.elements[i][j].tick()
        }
      }
      if (this.movingToTarget) {
          if (Math.abs(this.target.x - this.coords.x) > this.movingSpeed || Math.abs(this.target.y - this.coords.y) > this.movingSpeed) {
              var move = Util.getNextMove(this.coords.x, this.coords.y, this.target.x, this.target.y, this.movingSpeed)
              this.move(move[0], move[1])
              this.moveElements(move[0], move[1])
          }
      }
      this.move(-this.scene.currentSpeed * this.scene.direction,0)
    },
    
    addElementsToBlock : function(options){
      var counter = 0
      var blockObjectKlass = eval(options.obj.formClassName())
      for(var i=0;i<options.rows;i++){
        this.elements[i] = []
        for (var j = 0; j < options.columns; j++) {
            this.elements[i][j] = new blockObjectKlass(this.scene,0,this.lane, {handler:this.handler})
            var randomY = Math.round(Math.random()*12) - 6
            var randomX = Math.round(Math.random()*12) - 6
            this.elements[i][j].coords.x = this.coords.x + this.elementWidth * i - 20*j + randomX
            this.elements[i][j].coords.y = this.coords.y + this.elementHeight * j + randomY
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
        if(this.elements.length == 1){
            for(var i=0;i<this.elements[0].length;i++){
                this.handler.objects[this.lane].push(this.elements[0][i])
                this.elements[0][i].moveToTarget({x:this.coords.x+i*100 + this.getWidth()/2,y:this.elements[0][i].coords.y})
            }
        }else if(this.elements.length == 3){
            var b1 = new Block(this.scene,this.coords.x,0, {handler:this.handler})
            b1.coords.y = this.coords.y
            b1.elements = [this.elements[0]]
            b1.moveToTarget({x:this.coords.x,y:this.coords.y - this.getHeight()/2})
            var b2 = new Block(this.scene,this.coords.x,1,{handler:this.handler})
            b2.elements = [this.elements[1]]
            b2.coords.y = this.coords.y
            var b3 = new Block(this.scene,this.coords.x,2,{handler:this.handler})
            b3.elements = [this.elements[2]]
            b3.coords.y = this.coords.y
            b3.moveToTarget({x:this.coords.x,y:this.coords.y + this.getHeight()/2})
            this.handler.objects[this.lane-1].push(b1)
            this.handler.objects[this.lane].push(b2)
            this.handler.objects[this.lane+1].push(b3)
        }
        this.handler.objects[this.lane].remove(this)
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
    takePush : function(){
       this.pushes--
       if(this.pushes == 0) this.split()
    },
    moveElements : function(dx,dy){
        for (var i = 0; i < this.elements.length; i++) {
            for (var j = 0; j < this.elements[i].length; j++) {
                this.elements[i][j].move(dx,dy)
            }
        }
    },    
})

var TsquareScene = Class.create(Scene,{
    
    handlers: null,
    skyline: null,
    currentSpeed : 0,
    
    speeds : [
      {state :'idle' , value : 0 ,energy : 0},
      {state :'walk' , value : 3 ,energy : 1},
      {state :'jog' ,  value : 10,energy : 10},
      {state :'run' ,  value : 15,energy : 20}
    ],
    speedIndex : 0,
    direction : 1,
    energy : {current:0,rate : 3,max:30},
    view: {width: 760, height: 410, xPos: 0, tileWidth: 50, laneMiddle : 28},
    observer: null,
    activeLane: 1,
    commands : ["circle","march","wrongHold","rightHold","retreat"],
    
    initialize: function($super){
        $super();
        this.observer = new Observer();
        
        this.createRenderLoop('skyline',1);
        this.createRenderLoop('characters',2);
        this.physicsHandler = new PhysicsHandler(this)
        this.movementManager = new MovementManager(this)
        this.addMovementObservers()
        this.handlers = {
            "crowd" : new CrowdHandler(this),
            "enemies" : new EnemyHandler(this)  
        };  
        
        this.data = gameData.data;
        this.noOfLanes = this.data.length;
        for(var i =0;i<this.data.length;i++){
            for(var j=0;j<this.data[i].length;j++){
                var elem = this.data[i][j]
                if(this.handlers[elem.category])
                    this.handlers[elem.category].add(elem);
            }
        }
    },
    
    init: function(){
        this.skyLine = new SkyLine(this)
        //this.physicsHandler.step()
    },
    
    observe: function(event, callback){
        this.observer.addObserver(event, callback);
    },
    
    fire: function(event){
        this.observer.fire(event);
    },
    
    addMovementObservers : function(){
        var self = this
        this.observe('wrongMove',function(){self.decreaseEnergy()})
        this.observe('comboSuccess',function(){self.increaseEnergy()})
        var addMovementObserver = function(command){
            self.observe(command,function(){
                console.log(command)
                self[command]()
            })
        }
        for(var i=0;i<this.commands.length;i++){
            addMovementObserver(this.commands[i])   
        }
    },
    
    march : function(){
      this.direction = 1  
    },
    
    retreat : function(){
      this.direction = -1  
    },
    
    circle: function(){
        console.log("scene circle");
    },

    wrongHold: function(){
        this.energy.current -= this.energy.rate;
    },

    rightHold: function(){
        console.log("scene right hold");
    },
    
    tick: function($super){
        $super()
        this.detectCollisions();
        this.view.xPos += this.currentSpeed* this.direction
        for(var handler in this.handlers){
            this.handlers[handler].tick();
        }
    },

  addObject : function(objHash){
     var klassName = objHash.name.formClassName()
     var klass = eval(klassName)
     var obj = new klass(this,objHash.x * this.view.tileWidth - this.view.xPos,objHash.lane,objHash.options)
     var displayKlass = eval(klassName + "Display")
     var objDisplay = new displayKlass(obj)
     if (!obj.noDisplay) {
       this.pushToRenderLoop('characters', objDisplay)
     }
     return obj
  },
  
  tickObjects : function(objects){
    try{
            var remainingObjects = []
            var self = this
            objects.each(function(object){
                if(!object.finished){
                    object.tick()
                    remainingObjects.push(object)
                }
            })
            objects = remainingObjects
        }catch(x){//console.log(x)
            alert(x)
        }
        return this
  },
  
  detectCollisions : function(){
      
   for(var h1 in this.handlers){
     for (var h2 in this.handlers) {
         var handler1 = this.handlers[h1]; 
         var handler2 = this.handlers[h2]; 
       if(handler1.type=="left" && handler2.type=="right"){
         var collision = handler1.detectCollisions(handler2.objects)
         if(collision){
             this.handleCollision(collision)
         }else{
             this.direction = 1
         } 
       }
     }
   } 
  },
  
  handleCollision : function(collision){
      this.direction = 0;
  },
    
  increaseEnergy : function(){
    if(this.energy.current < this.energy.max)this.energy.current+= this.energy.rate
    var next = this.speeds[this.speedIndex+1]
    if(next){
        if(this.energy.current>=next.energy){
            this.speedIndex++
            this.currentSpeed = this.speeds[this.speedIndex].value
            this.fire(next.state)
        } 
    }
   },
   
   decreaseEnergy : function(){
      this.energy.current= Math.max(this.energy.current-this.energy.rate, 0)
      if(this.speedIndex >0 && this.energy.current < this.speeds[this.speedIndex].energy){
          this.speedIndex--
          this.currentSpeed = this.speeds[this.speedIndex].value
          this.fire(this.speeds[this.speedIndex].state)
      } 
   }
  
});
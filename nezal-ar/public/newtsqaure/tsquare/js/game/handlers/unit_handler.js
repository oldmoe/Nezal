var UnitHandler = Class.create({
   
   objects: null,
   incomming: null,
   scene: null,
   
   
   initialize: function(scene){
       this.incomming = [];
       this.objects = [];
       this.scene = scene;       
   },
   
   tick: function(){
       this.checkObjectsState();
       var self = this;
       this.objects.each(function(laneObjects){self.scene.tickObjects(laneObjects)})
   },
   
   add: function(elem){
       if(this.incomming[elem.lane] == null){
         this.incomming[elem.lane] = [];
         this.objects[elem.lane] = [];  
       } 
      this.incomming[elem.lane].push({'name':elem.name, x:elem.x*this.scene.view.tileWidth,y:elem.lane,options:{handler:this}})
   },
   
  checkObjectsState : function(){
    for (var i = 0; i < this.objects.length; i++) {
      for (var j = 0; this.objects[i] && j < this.objects[i].length; j++) {
         if(this.objects[i][j].dead){
           this.objects[i][j].destroy()
           this.objects[i].splice(j, 1)
           j--
         }  
      }
    }
    for(var i=0;i<this.incomming.length;i++){
      for(var j=0; this.incomming[i] && j<this.incomming[i].length;j++){
        if (this.incomming[i][j].x < this.scene.view.xPos + this.scene.view.width) {
          this.objects[i].push(this.scene.addObject(this.incomming[i][j]))
          this.incomming[i].splice(0, 1)
          j--;
        }
        else {
          break
        }
      }
    }
  },
  
  detectCollisions : function(others){
    var collision = [];
    for(var i=0;i<this.objects.length;i++){
        if(this.objects[i] && this.objects[i][0] && !this.objects[i][0].rotating){
          var collided = false
          for(var j=0;j<this.objects[i].length;j++){             
            if(others[i] && others[i][0] ){               
                if(this.objects[i][j].collidesWith(others[i][0])){
                    others[i][0].setTarget(this.objects[i][j]);                 
                    collided = true;
                    break; 
                }                
             }
           }
           if(others[i] && others[i][0] && !collided){
               others[i][0].setTarget(null);                  
           } 
           for(var j=0;j<this.objects[i].length;j++){                      
                if(collided){
                    this.objects[i][j].setTarget(others[i][0]);       
                }else{
                    this.objects[i][j].setTarget(null); 
                }
           }
       }
    }
    if(collision.length > 0) return true
    return false
  },
  
   removeObject: function(object, lane){
      if(this.objects[lane].indexOf(object)!=-1){
          object.destroy();
          this.objects[lane].remove(object);
      }
   }
      
    
});
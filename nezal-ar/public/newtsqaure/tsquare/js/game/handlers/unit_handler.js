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
      if(this.objects[i]){
         
         var visited = [];   
         for (var k = 0; k < others[i].length; k++) {
             visited[k] = null;
         }
     
          for(var j=0;j<this.objects[i].length;j++){
            if(others[i]){
               var collid = -1; 
                for (var k = 0; k < others[i].length; k++) {
                  if (this.objects[i][j].coords.x + this.objects[i][j].getWidth() > others[i][k].coords.x) {
                      collid = k;
                      visited[k] = j;
                   }
                }
                
                if(collid >= 0){
                      collision.push({
                          crowd: this.objects[i][j],
                          obstacle: others[i][collid],
                          lane : i
                      })
                    this.objects[i][j].setTarget(others[i][collid]);
                }
            }         
          }
          
          for (var k = 0; k < visited.length; k++) {
              if(visited[k] != null){
                  collision.push({
                      crowd: this.objects[i][visited[k]],
                      obstacle: others[i][k],
                      lane : i
                  })
                  others[i][k].setTarget(this.objects[i][visited[k]]);
              }
              else
                  others[i][k].setTarget(null);
          }
       }
    }
    if(collision.length > 0) return true
    return false
  }    
    
});
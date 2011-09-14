var CrowdHandler = Class.create(UnitHandler, {
    
   type : "left",   
   initialPositions : [{x:50,y:30},{x:50,y:100},{x:50,y:200}],
   crowdMembersPerColumn : 2,
   marchingStates: ["IDLE", "WALK", "JOG", "RUN"],
   commands: ["circle", "hold", "march", "retreat"],
   
   initialize: function($super,scene){
       $super(scene)
       this.addCommandObservers()
       this.registerStateObservers();
   },
   
   addCommandObservers : function(){
       var self = this
       this.commands.each(function(event){
          self.scene.observe(event,function(){self[event]()}); 
       });
   },
   
   hold: function(){
     if(this.scene.handlers.enemy.objects[this.scene.activeLane][0] && 
       this.scene.handlers.enemy.objects[this.scene.activeLane][0].type == "charging_amn_markazy"){
         
        this.scene.fire("rightHold");
        
        this.executeCommand("hold");
        var averagePoint = {x: 0, y: 0};
        var count = 0;
        for(var i=0;i<this.objects.length;i++){
            for(var j=0;this.objects[i] && j<this.objects[i].length;j++){
              if(this.objects[i][j]){
                count++;
                averagePoint.x += this.objects[i][j].coords.x;
                averagePoint.y += this.objects[i][j].coords.y; 
              }
            }
        }
        
        if(count > 0){
          averagePoint.x /= count;
          averagePoint.y /= count;
        }
  
        for(var i=0;i<this.objects.length;i++){
            for(var j=0;this.objects[i] && j<this.objects[i].length;j++){
              if(this.objects[i][j]){
                this.objects[i][j].moveToTarget({x:averagePoint.x+Math.random()*50, y:averagePoint.y});
              }
            }
        }
     }else{
       this.scene.fire("wrongHold");
     }
     
   },

   march: function(){
       this.executeCommand("march");
   },
   
   retreat: function(){
       this.executeCommand("retreat");
   },

   circle: function(){
       this.executeCommand("circle");
   },
   
   executeCommand : function(event){
     for(var i=0;i<this.objects.length;i++){
       if(this.objects[i])
       for(var j=0;j<this.objects[i].length;j++){
           this.objects[i][j][event]();
       }
     }          
   },

   registerStateObservers : function(){
       var self = this
       this.marchingStates.each(function(event){
           self.scene.observe(event,function(){self.setCrowdMembersState(event)})
       });
   },
   
   setCrowdMembersState : function(event){
       for(var i=0;i<this.objects.length;i++){
           if(this.objects[i])
           for(var j=0;j<this.objects[i].length;j++){
               this.objects[i][j].fire(event)
            }
       }
   } 
     
});
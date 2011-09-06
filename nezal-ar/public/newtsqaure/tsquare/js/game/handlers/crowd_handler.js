var CrowdHandler = Class.create(UnitHandler, {
   type : "left",   
   initialPositions : [{x:200,y:30},{x:200,y:100},{x:200,y:200}],
   crowdMembersPerColumn : 2,
   marchingStates: ["IDLE", "WALK", "JOG", "RUN"],
   commands: ["circle", "hold", "march", "retreat"],
   
   initialize: function($super,scene){
       $super(scene)
       this.addCommandObservers()
       this.registerStateObservers()
   },
   
   addCommandObservers : function(){
       var self = this
       this.commands.each(function(event){
          self.scene.observe(event,function(){self.executeCommand(event)}); 
       });
   },
   
   executeCommand : function(event){
       
     for(var i=0;i<this.objects.length;i++){
           if(this.objects[i])
           for(var j=0;j<this.objects[i].length;j++){
               
               this.objects[i][j][event]()
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
   },
   
   removeObject: function(object, lane){
      if(this.objects[lane].indexOf(object)!=-1){
          object.destroy();
          this.objects[lane].remove(object);
      }
   }
   
});
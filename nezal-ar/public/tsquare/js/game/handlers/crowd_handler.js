var CrowdHandler = Class.create(UnitHandler, {
   type : "left",   
   initialPositions : [{x:150,y:30},{x:150,y:100},{x:150,y:200}],
   crowdMembersPerColumn : 2,
   marchingStates: ["normal", "walk", "jog", "run"],
   commands: ["circle", "hold", "march", "retreat"],
   initialize: function($super,scene){
       $super(scene)
       this.addCommandObservers()
       this.registerStateObservers();
   },
    tick : function($super){
      if(this.pushing)this.pushMove()
      else $super()
    },
    getUserCrowds : function(){
       this.userCrowds = []
       var userCrowds = user_data['crowd_members']
       for(var crowdType in userCrowds){
           for(var crowd in userCrowds[crowdType]){
               var crowdMember = userCrowds[crowdType][crowd]
               var level = crowdMember.level
               var category = gameData.crowd_members.category[crowdType]
               if(!category) category = crowdType
               var specs = gameData.crowd_members.specs[category][level]
               this.addCrowdMember(crowdType,specs)
           }
       } 
    },
    start : function(){
      this.getUserCrowds();  
    },
   addCrowdMember : function(name,specs){
     var klassName = name.formClassName()
     var klass = eval(klassName)
     var obj = new klass(specs,{handler : this, scene:this.scene})
     var displayKlass = eval(klassName + "Display")
     var objDisplay = new displayKlass(obj)
     this.objects[this.scene.activeLane].push(obj)
     if (!obj.noDisplay) {
       this.scene.pushToRenderLoop('characters', objDisplay)
     }
     return obj
   },  
   addCommandObservers : function(){
       var self = this
       this.commands.each(function(event){
          self.scene.observe(event,function(){self[event]()}); 
       });
   },
   
   hold: function(){
     var enemy = this.scene.handlers.enemy.objects[this.scene.activeLane][0]; 
     if( enemy && enemy.type == "charging_amn_markazy"){
       
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
  
        var distance = 0;
        var minDistance = 100000;
  
        for(var i=0;i<this.objects.length;i++){
            for(var j=0;this.objects[i] && j<this.objects[i].length;j++){
              if(this.objects[i][j]){
                this.objects[i][j].moveToTarget({x:averagePoint.x+Math.random()*50, y:averagePoint.y});
                distance = Util.distance(enemy.coords.x,enemy.coords.y,this.objects[i][j].coords.x,this.objects[i][j].coords.y);
                if(distance < minDistance)
                  minDistance = distance;
              }
            }
        }
        
        var holdingLevel = 1;
        if(minDistance < enemy.getWidth()*2)
          holdingLevel = 2;
          
        this.scene.fire("rightHold");
        this.executeCommand("hold", {holdingLevel: holdingLevel});

     }else{
       this.scene.fire("wrongHold");
     }
     
   },

   march: function(){
     if(this.target && this.target.chargeTolerance <= 0) this.target = null
     if (!this.target) {
      return this.executeCommand("march");
     }
     this.pushing = true
     this.pushMove()
   },
   pushMove : function(){
    if(!this.target || this.target.chargeTolerance <= 0){
      this.target = null
      this.pushing = false
      return
    }
    var closestIndex = -1;
    var maxX = 0
    for (var j = 0; j < this.objects[this.target.lane].length; j++) {
      if(this.objects[this.target.lane][j].coords.x > maxX){
        closestIndex = j
        maxX = this.objects[this.target.lane][j].coords.x
      }
    }
    var reverseDirection = false
    for (var j = 0; j < this.objects[this.target.lane].length; j++) {
      var ret = this.objects[this.target.lane][j].pushMove(this.target)
      if(j == closestIndex && ret == true && 
      true//this.objects[this.target.lane][j].pushDirection == this.objects[this.target.lane][j].pushDirections.forward
      ){
        reverseDirection = true
      }
    }
    if (reverseDirection) {
      this.target.takePush()
      console.log(this.target.chargeTolerance)
      for (var j = 0; j < this.objects[this.target.lane].length; j++) {
        this.objects[this.target.lane][j].pushDirection = 1 - this.objects[this.target.lane][j].pushDirection
        this.objects[this.target.lane][j].moved = 0
      }
    }  
   },
   
   
   retreat: function(){
       this.executeCommand("retreat");
   },

   circle: function(){
       this.executeCommand("circle");
   },
   
   executeCommand : function(event, options){
     for(var i=0;i<this.objects.length;i++){
       if(this.objects[i])
       for(var j=0;j<this.objects[i].length;j++){
           this.objects[i][j][event](options);
       }
     }          
   },

   registerStateObservers : function(){
       var self = this
       this.marchingStates.each(function(event){
           self.scene.observe(event,function(){self.setCrowdMembersState(event)})
       });
   },
   end : function(){
     this.scene.end(false)
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
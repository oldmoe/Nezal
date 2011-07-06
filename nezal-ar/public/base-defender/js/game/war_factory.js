var WarFactory = Class.create(Building, {
    initialize: function($super, factory, buildingSpecs){
      $super(factory, buildingSpecs);
      var self = this
      this.game.reactor.pushPeriodical(0, 1, game.reactor.everySeconds(1), function(){
          self.processCreepGeneration()
        })
    },
    processCreepGeneration : function(){
      if(this.queue && this.queue.size>0 && !this.queue.stopped){
        this.queue.remaining_time--;
        if(this.queue.remaining_time<=0){
          var self = this;
          this.startCreepAnimation(this.queue['creep'])
          game.reInitialize(function(){
            game.creepPanel.fillTemplate(self);
          });
        }
      }
    },
    startCreepAnimation : function(c){
      var creepCoords = {x:this.coords.x+40,y:this.coords.y+40}
      var creep = this.game.creepFactory.newCreep(c.capitalize(),0,Map.N,true,creepCoords)
      game.persistentObjects.push({'obj': creep,'type': 'Car', 'factory':'creep'})
      var garages = game.garageFactory.factoryRegistry
      var firstGarage = null
      for(var garage in garages){
         firstGarage = garages[garage]
         break
      }
      if(!firstGarage) return
      var coords = firstGarage.coords
      Map.moveObject(creep,coords.x,coords.y-30, function(){
        game.persistentObjects.remove(creep)  
        creep.targetAngle = Map.SW
        creep.coords.x = coords.x
        creep.coords.y = coords.y - 30
        var garages = game.garageFactory.factoryRegistry
        var firstGarage = null
        for(var garage in garages){
         firstGarage = garages[garage]
         break
        }
        firstGarage.receivedCreep = creep
        firstGarage.receivingCreep = true        
      })      
    }
});
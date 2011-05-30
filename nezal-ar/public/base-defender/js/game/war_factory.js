var WarFactory = Class.create(Building, {
    initialize: function($super, factory, buildingSpecs){
      $super(factory, buildingSpecs);
      var self = this
      this.game.reactor.pushPeriodical(0, 1, game.reactor.everySeconds(1), function(){
          self.processCreepGeneration()
        })
    },
    processCreepGeneration : function(){
       if(this.queue.size>0){
         this.queue.remaining_time--;
         if(this.queue.remaining_time<=0){
           this.queue.size--;
           this.queue.remaining_time = this.queue.creep_production_time
         }
       }
    }
});
var CreepPanel = Class.create({
  initialize : function(game){
    this.game = game
    this.enabled = []
    this.disabled = []
    this.creeps = game.data.creeps    
    this.creepNames = []
    for(var creep in this.creeps){
      this.creepNames.push(creep)
    }
    var self = this
    this.game.reactor.pushPeriodical(0, 1, game.reactor.everySeconds(0.5), function(){
          self.displayTime()
        })
  },
  cancelCreep : function(){
    this.displayed = true
    if(this.wf.queue.size==0)return
    this.wf.queue.size--
    var creepData = this.game.data.creeps[this.wf.queue.creep]
    game.resources.rock+=creepData.needs.rock
    game.resources.lumber+=creepData.needs.lumber
    if(this.wf.queue.size==0) this.wf.creep = null  
    this.displayPanel(this.wf)
    this.game.network.cancel_creep_generation({'war_factory':this.wf.id})
  },
  generateCreep : function(creep){
    this.displayed = true
    if (this.wf.queue.size < this.game.data.buildings.war_factory.levels[this.wf.level].max_queue_size) {
      this.wf.queue.creep = creep
      var creepData = this.game.data.creeps[creep]
      if(!(game.resources.rock >= creepData.needs.rock && game.resources.lumber >= creepData.needs.lumber)) {
        Notification.alert('Not enough resources')
        return
      } 
      this.wf.queue.size++
      if (this.wf.queue.size == 1) {
        this.wf.queue.creep_production_time = creepData.needs.time
        this.wf.queue.remaining_time = creepData.needs.time
      }
      game.resources.rock-=creepData.needs.rock
      game.resources.lumber-=creepData.needs.lumber
      this.displayPanel(this.wf)
      this.game.network.generate_creep({
        'war_factory': this.wf.id,
        'creep': creep
      })
    }else{
      Notification.alert('You have reached maximum number of creeps to generate');
    }
  },
  displayTime : function(){
    var div = $$('#creepInProgress #remainingTime')[0]
    if(div){
      if (this.wf && this.wf.queue.size > 0) {
        div.innerHTML = Util.timeDisplay(this.wf.queue.remaining_time)
      }else if(this.wf){
        this.displayed = true
        this.displayPanel(this.wf)
      }
    }
//    
//      this.displayed = true
//      this.displayPanel(this.wf)
//    }
  },
  displayPanel : function(wf,options){
    var disabled = []
    this.wf = wf || this.wf
    var self = this
    $('creepDisplay').innerHTML = this.game.templatesManager.load("creep-panel", {'creeps' : this.creeps,'queue':wf.queue, 'disabled' : this.disabled});
    this.game.addLoadedImagesToDiv("creepDisplay");
    var cancelDiv = $$('#creepDisplay #inPorgressCancel')[0]
    if(cancelDiv){
      cancelDiv.observe('click',function(){
        self.cancelCreep()
      })
    }
    $('interaction').show();
   if(!this.displayed) Animation.show("creepDisplay");
   this.displayed = false
  },
})
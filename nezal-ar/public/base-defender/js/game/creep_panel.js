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
    document.observe('keydown', function(event){
      if (event.keyCode == 67) {
        self.displayPanel();
      }
    });
  },
  cancelCreep : function(){
    
  },
  generateCreep : function(){
    
  },
  displayPanel : function(options){
    var disabled = []
    $('creepDisplay').innerHTML = this.game.templatesManager.load("creep-panel", {'creeps' : this.creepNames, 'disabled' : this.disabled});
    this.game.addLoadedImagesToDiv("creepDisplay");
    $('interaction').show();
    Animation.show("creepDisplay");
  },
})
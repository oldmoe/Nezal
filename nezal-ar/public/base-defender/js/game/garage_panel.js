var GaragePanel = Class.create({
    initialize : function(game){
    this.game = game
    this.creeps = game.user.data.creeps
    var self = this   
    document.observe('keydown', function(event){
      if (event.keyCode == 71) {
        self.displayPanel()
      }
    }); 
  },
  displayPanel : function(options){
    var disabled = []
    var self = this
    this.fillTemplate()
    $$('#garageDisplay .barFiller')[0].style.width = ((game.user.data.garage_units_used/game.user.data.total_garage_units) * 100) + "%"
    $$('#garageDisplay #garageCapacityNumber')[0].innerHTML = game.user.data.garage_units_used+"/"+game.user.data.total_garage_units
    $('interaction').show();
    Animation.show("garageDisplay");
  },
   fillTemplate : function(){
    var self = this
    $('garageDisplay').innerHTML = this.game.templatesManager.load("garage-panel", {'creeps' : this.creeps, 'disabled' : this.disabled});
    this.game.addLoadedImagesToDiv("garageDisplay");
  }

})
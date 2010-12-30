var BuildingsManager = Class.create({

  initialize : function(game){
    this.game = game
  },

  displayBuildingsPanel : function(){
    var buildings = {};
    for ( var i in this.game.data.buildings) {
      buildings[i] = this.game.data.buildings[i]['levels'][1];
    }
    $('buildingDisplay').innerHTML = this.game.templatesManager.buildingsPanel(buildings);
    $('buildingDisplay').show();
  },

  displayBuildButton : function(){
    $('buildingDisplay').innerHTML = this.game.templatesManager.buildButton();
    $('buildingDisplay').show();
  },
  
  build : function(building){
      game.buildingMode.on(self.game.townhallFactory.newTownhall(), function(){
    
      });
  }

})

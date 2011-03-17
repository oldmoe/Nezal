var BuildingPanelDisplay = Class.create({
  initialize : function(game){
    game.reInitializationNotifications.push(function(){
      if (game.selectedBuildingPanel && game.selectedBuildingPanel.selectedBuilding) {
        BuildingFactory._GlobalRegistry[game.selectedBuildingPanel.selectedBuilding.id].renderPanel();
      }
    });
  }
});

var GarageDisplay = Class.create(BuildingDisplay, {
  initialize : function($super,owner,properties){
      this.defaultAction = this.renderGarageMenu;
      $super(owner,properties)
  },
  renderPanel: function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
  },
  renderGarageMenu : function(){
    Sounds.play(Sounds.gameSounds.click);
    game.garagePanel.displayPanel(this.owner,{'disabled' : []});
  },
});

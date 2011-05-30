var GarageDisplay = Class.create(BuildingDisplay, {
  initialize : function($super,owner,properties){
      $super(owner,properties)
  },
  renderPanel: function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
  }
});

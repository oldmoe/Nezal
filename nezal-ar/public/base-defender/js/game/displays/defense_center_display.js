var DefenseCenterDisplay = Class.create(BuildingDisplay, {
  renderPanel: function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
    this._AttachUpgradeTrigger();
  }
});
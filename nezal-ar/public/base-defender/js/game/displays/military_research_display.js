var MilitaryResearchDisplay = Class.create(ResearchBuildingDisplay, {

  initialize : function($super,owner,properties){
    this.animateImg = Loader.images.buildings[owner.name + "_animation.png"];
    $super(owner,properties)
  },

  createSprites : function($super){
    $super();
  },

  renderPanel: function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
  }

});

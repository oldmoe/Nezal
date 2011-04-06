var DefenseCenterDisplay = Class.create(BuildingDisplay, {
  initialize : function($super,owner,properties){
      $super(owner,properties)
	  this.sprites.clickSprite.setImgWidth(103)
	  this.sprites.clickSprite.setImgHeight(121)
	  this.sprites.clickSprite.shiftX =15
	  this.sprites.clickSprite.shiftY = 21 
  },
  renderPanel: function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
  }
});
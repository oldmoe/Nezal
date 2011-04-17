var DefenseCenterDisplay = Class.create(BuildingDisplay, {
  initialize : function($super,owner,properties){
    this.defaultAction = this.renderDefenseMenu;
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
  },
  renderDefenseMenu : function(){
    Sounds.play(Sounds.gameSounds.click);
    this.game.buildingsManager.displayBuildingsPanel({'disabled' : []});
    this.game.buildingsManager.displayDefenseTab();
  }
});

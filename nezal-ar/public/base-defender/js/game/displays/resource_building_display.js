var ResourceBuildingDisplay = Class.create(BuildingDisplay, {
  initialize : function($super,owner,properties){
    $super(owner,properties)
    this.sprites.text = new DomTextSprite(owner, 'resource',{centered: true, shiftY: 110});
  },

  manageStateChange : function($super){
    $super()
    var self = this;
    this.owner.stateNotifications[this.owner.states.NOT_PLACED].push(function(){
      self.sprites.text.hide()
    });
    this.owner.stateNotifications[this.owner.states.UNDER_CONSTRUCTION].push(function(){
      self.sprites.text.hide()
    });
    this.owner.stateNotifications[this.owner.states.UPGRADING].push(function(){
      self.sprites.text.hide()
    });
    this.owner.stateNotifications[this.owner.states.NORMAL].push(function(){
      if(self.owner.game.neighborGame == true)
        self.sprites.text.hide()
      else
        self.sprites.text.show()
    });
  },
  
  renderPanel : function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){
      return self.game.templatesManager.resourceBuildingPanel(self);
    });
  },
  
  renderPanelButtons: function($super){
    $super();
    
    var owner = this.owner;
    $("dom_converter").innerHTML = this.game.templatesManager.resourceBuildingPanelButtons();
    $('panel-buttons-container').appendChild( $("collect_resource_trigger") );
    $('panel-buttons-container').appendChild( $("assign_worker_trigger") );
    
    $('collect_resource_trigger').observe('click', function(){
      owner._CollectResources();
      owner.game.selectedBuildingPanel.hide();
    });
    
    $('assign_worker_trigger').observe('click', function(){
      owner._AssignWorker();
      owner.game.selectedBuildingPanel.hide();
    });
  }
});

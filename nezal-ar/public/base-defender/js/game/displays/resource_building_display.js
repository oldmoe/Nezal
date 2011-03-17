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
      self.sprites.text.show()
    });
  },

  renderPanel : function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){
      return self.game.templatesManager.resourceBuildingPanel(self);
    });
    this._AttachAssignTrigger();
    this._AttachUpgradeTrigger();
  },
  
  _AttachAssignTrigger: function(){
    var owner = this.owner;
    if($$('.building-functions').any()){
      var trigger = $('assign_worker_trigger');    
      trigger.observe('click', function(){
        owner._AssignWorker();
      });

      trigger = $('collect_resources_trigger');
      trigger.observe('click', function(){
        owner._CollectResources();
      });
    }
  }
});

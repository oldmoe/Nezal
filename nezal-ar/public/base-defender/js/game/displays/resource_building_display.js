var ResourceBuildingDisplay = Class.create(BuildingDisplay, {
  initialize : function($super,owner,properties){
    $super(owner,properties)
    this.sprites.text = new DomTextSprite(owner, 'resource',{centered: true, shiftY: 110});
  	this.attentionImg = Loader.images.icons['attention.png']
  	this.sprites.attention = new DomImgSprite(this.owner,{img:this.attentionImg}, {shiftX : 40,shiftY : -30})
  	this.sprites.attention.hide()
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
      return self.game.templatesManager.load(self.name + "-panel", {building : self});
    });
  },
  
  render : function($super){
  	$super()
	 if(this.owner.full)this.sprites.attention.show()
  },
  
  renderPanelButtons: function($super){
    $super();
    if(this.owner.full) this.sprites.attention.show()
    var owner = this.owner;
    this.game.domConverter.convert( this.game.templatesManager.load("resource-building-buttons") );
    $('panel-buttons-container').appendChild( $("collect_resource_trigger") );
    $('panel-buttons-container').appendChild( $("assign_worker_trigger") );
    
    $('collect_resource_trigger').observe('click', function(){
	  Sounds.play(Sounds.gameSounds.resource_collection)
      owner._CollectResources();
      owner.game.selectedBuildingPanel.hide();
    });
    
    $('assign_worker_trigger').observe('click', function(){
      owner._AssignWorker();
      owner.game.selectedBuildingPanel.hide();
    });
  }
});

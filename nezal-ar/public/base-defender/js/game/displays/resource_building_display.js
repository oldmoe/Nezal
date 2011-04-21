var ResourceBuildingDisplay = Class.create(BuildingDisplay, {
  initialize : function($super,owner,properties){
    this.defaultAction = this.collectResources;
    $super(owner,properties)
	  var self = this
    this.sprites.text = new DomTextSprite(owner, 'resourceInfo',{centered: true, shiftY: 110});
  	this.attentionImg = Loader.images.icons['attention.png']
  	this.sprites.attention = new DomImgSprite(this.owner,{img:this.attentionImg}, {shiftX : 40,shiftY : -30})
  	this.sprites.resourceMeter = new DomMeterSprite(this.owner, {
		orientation: "vertical",
		meterFunc: function(){
			return self.owner.getResourceMeterLength()
		},
		styleClass:{empty:'resourceEmpty',full:'resourceFull'},
		shiftX: this.owner.imgWidth / 2,
		shiftY: 40,
		height : 60
	})
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
    var self = this;
    this.game.domConverter.convert( this.game.templatesManager.load("resource-building-buttons") );
    $('panel-buttons-container').appendChild( $("collect_resource_trigger") );
    $('panel-buttons-container').appendChild( $("assign_worker_trigger") );
    
    $('collect_resource_trigger').observe('moousedown', function(){
		$('collect_resource_trigger').select("img")[0].setStyle( {marginTop: "-50px"} );
    });
	$('collect_resource_trigger').observe('mouseup',function(){
		$('collect_resource_trigger').select("img")[0].setStyle( {marginTop: "-25px"} );
		$('building-panel').hide();
      	self.collectResources();
	})
    
    $('assign_worker_trigger').observe('mousedown', function(){
	  $('assign_worker_trigger').select("img")[0].setStyle( {marginTop: "-50px"} );
    });
	$('assign_worker_trigger').observe('mouseup',function(){
		$('assign_worker_trigger').select("img")[0].setStyle( {marginTop: "-25px"} );
		owner._AssignWorker();
      	$('building-panel').hide();
	})
    this.registerHoverEvents('collect_resource')
	this.registerHoverEvents('assign_worker')
    this.renderingPanelButtonsDone();
  },

  collectResources : function(){
	  Sounds.play(Sounds.gameSounds.resource_collection)
    if(this.owner.assignedWorkers > 0)
      this.owner._CollectResources();
    else
      this.owner._AssignWorker();
  }
});

var ResourceBuildingDisplay = Class.create(BuildingDisplay, {
  initialize : function($super,owner,properties){
    this.defaultAction = this.collectResources;
    $super(owner,properties)
	  var self = this
    this.sprites.text = new DomTextSprite(owner, 'resourceInfo',{centered: true, shiftY: 110, styleClass:'resourceText'});
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
    });
	
  },
  
  renderPanel : function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){
      return self.game.templatesManager.load(self.name + "-panel", {building : self});
    });
  },
  
  createSprites : function($super){
    $super();
    this.assignWorkerImg = Loader.images.default_actions["assign_worker.png"];
    this.sprites.defaultAssign = new DomImgSprite(this.owner, {img: this.assignWorkerImg});
    this.sprites.defaultAssign.img.setStyle({width:"40px"});
    this.sprites.defaultAssign.hide();
  },
  
  defaultActionSprite : function(){
    if( this.owner.assignedWorkers > 0) {
      return this.sprites.defaultMouseover = this.sprites.mouseover;
    } else {
      return this.sprites.defaultMouseover = this.sprites.defaultAssign;
    }
  },
  
  render : function($super){
    $super();
    
    if(this.owner.full) this.sprites.attention.show();
  },
  
  renderPanelButtons: function($super){
    $super();
    if(this.owner.full) this.sprites.attention.show();
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
    this.registerHoverEvents('collect_resource');
	  this.registerHoverEvents('assign_worker');
    this.renderingPanelButtonsDone();
  },

  collectResources : function(){
    var owner = this.owner
    if (owner.assignedWorkers > 0) {
      var checkFullErrorMessage = function(){
        if (owner.game.resources[owner.factory.collect] == owner.factory.getTotalStorageCapacity()) {
          Notification.alert('You need more storage. Try to build or upgrade your storage buildings.')
          return true
        }
        return false
      }
//      if (checkFullErrorMessage()) 
//        return Sounds.play(Sounds.gameSounds.resource_collection)
      var collected = owner[owner.factory.collect]
      var currentResources = owner.game.resources[owner.factory.collect]
      var totalStorage = owner.factory.getTotalStorageCapacity()
      if (collected + currentResources > totalStorage) {
        collected = totalStorage - currentResources;
      }
      owner._CollectResources();
      this._CollectionAnimation(collected);
      checkFullErrorMessage();
    } else {
      owner._AssignWorker();
    }
  },
  _CollectionAnimation : function(collected){
    var owner = this.owner
    var html = owner.game.templatesManager.load("collectAnimation",{
      building_name: owner.name,
      collected: collected
    })
    owner.game.domConverter.convert(html)
    var collectionDiv = $$('.collectionAnimation')[$$('.collectionAnimation').length-1]
      collectionDiv.setStyle({
        'top': owner.coords.y + "px",
        'left': (owner.coords.x - 15) + "px"
      })
      $('gameCanvas').appendChild(collectionDiv)
      Animation.springFade(collectionDiv, -105)
  }
});

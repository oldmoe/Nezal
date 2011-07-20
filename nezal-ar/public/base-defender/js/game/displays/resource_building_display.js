var ResourceBuildingDisplay = Class.create(BuildingDisplay, {
  initialize : function($super,owner,properties){
    this.defaultActionName = "collect"
    this.defaultAction = this.collectResources;
    this.defaultNeighborAction = this.collectNeighborResources;
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

  },
  fillBuildingPanel : function($super,owner){
    if (this.owner.assignedWorkers > 0) {
      this.defaultActionName = "Collect"
    }else{
      this.defaultActionName = "Worker"
    }
    $super(owner)
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
    if(this.owner.game.neighborGame && (this.owner[this.owner.factory.collect] > 0 || this.owner.assignedWorkers > 0) )
    {
      this.staticSprites.collectContainer = new DomSpriteContainer(this.owner, {zIndex : this.sprites.clickSprite.minAreaZIndex + 1100,
                                                          width :this.buttonImg.width, height : this.buttonImg.height });
      this.staticSprites.collectContainer.shiftX = (this.imgWidth- this.buttonImg.width)/2+2;
      this.staticSprites.collectContainer.shiftY = 0;
    }
    for(var sprite in this.staticSprites){
      this.staticSprites[sprite].render();
    }
  },
  
  defaultActionSprite : function(){
      return this.sprites.defaultMouseover = this.sprites.mouseover;
  },

  defaultNeighborActionSprite : function(){
    if( (this.owner[this.owner.factory.collect] > 0 || this.owner.assignedWorkers > 0))
      return this.sprites.defaultMouseover = this.sprites.mouseover;
    else
      return this.sprites.defaultMouseover = this.sprites.neighborMouseover;
  },
  
  render : function($super){
    $super();    
    if(this.owner.full) this.sprites.attention.show();
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

  collectNeighborResources : function(){
    var hasEnergy = this.owner.game.energy.energy > 0;
    if( (this.owner[this.owner.factory.collect] > 0 || this.owner.assignedWorkers > 0) && hasEnergy ) {
      this.owner.game.energy.energy--;
      this.owner._CollectNeighborResources();
      this.owner.game.collectedRewardBags ++;
      this._NeighborCollectionAnimation();
      this.owner.game.rewardsPanel.handleRewards();
    }
    console.log("Here Here")
    if( !hasEnergy ){
      Notification.alert('You need more energy.');
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
      collectionDiv.addClassName('smallBlackOutline')
      $('gameCanvas').appendChild(collectionDiv)
      Animation.springFade(collectionDiv, -105, function(){if(collectionDiv.parentNode)collectionDiv.parentNode.removeChild(collectionDiv)})
  },

  _NeighborCollectionAnimation : function(){
    var owner = this.owner
    var html = owner.game.templatesManager.load("neighborCollectAnimation",{
      building_name: owner.name,
      type : owner.factory.collect
    })
    owner.game.domConverter.convert(html)
    var collectionDiv = $$('.collectionAnimation')[$$('.collectionAnimation').length-1]
      collectionDiv.setStyle({
        'top': owner.coords.y - owner.imgHeight/2 + "px",
        'left': (owner.coords.x - 15) + "px"
      })
      $('gameCanvas').appendChild(collectionDiv)
      owner.game.addLoadedImagesToDiv('neighborCollect');
      Animation.springFade(collectionDiv, -70)
  }
});

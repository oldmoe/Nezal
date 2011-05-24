var BuildingDisplay = Class.create(Display, {
  panelWidth : 350,
  numberOfSmokes : 3,
  smokes : null,
  smokeImg : null,
  smokeElevation : null,
  smokeXMovementLimit : 15,
  smokeSmallSizeLimit : 5,
  smokeLargeSizeLimit : 23,
  smokeInitialXShift : 0,
  progressDisplays : [] ,
  initialize : function($super,owner,properties){
    $super(owner,properties);
    if (this.owner.state == this.owner.states.UNDER_CONSTRUCTION)this.createUnderContructionElements();
    this.noOfXTiles = Math.ceil(this.xdim / Map.tileIsoLength);
    this.noOfYTiles = Math.ceil(this.ydim / Map.tileIsoLength);
    if (this.noOfXTiles == 1) {
      this.smokeInitialXShift = 58
    }else if (this.noOfXTiles == 2) {
      this.smokeInitialXShift = 90
    }else if (this.noOfXTiles == 3) {
      this.smokeInitialXShift = 110
    } 

    this.owner = owner
    /* Check for level Img for the building & its hover */
    for(var i = this.owner.level; i>0; i--)
    {
      this.img = Loader.images.buildings[this.owner.name + "_" + i +'.png'];
      this.outlineImg = Loader.images.buildingOutlines[this.owner.name + "_outline_" + i +  ".png"];
      if(this.img)  
        break;
    }
    /* Use the default image if level not found */
    if(!this.img) this.img = Loader.images.buildings[this.owner.name+'.png'];
    if(!this.outlineImg) this.outlineImg = Loader.images.buildingOutlines[this.owner.name+"_outline.png"];

    /* Set Default Onclick Action */
    if(!this.defaultAction)
      this.defaultAction = this.renderPanel;
    /* Set Default Onclick Action for neighbor visits*/
    if(!this.defaultNeighborAction)
      this.defaultNeighborAction = function(){};

    var buildImgName = this.noOfXTiles+"x"+this.noOfYTiles
    this.invalidImg =  Loader.images.buildingModes[buildImgName+"_invalid.png"];
    this.constructionImg = Loader.images.buildingModes['construction_tile_'+buildImgName+'.png']
    this.baseImg = Loader.images.buildingModes[buildImgName+'_base.png'];
    this.shadowImg = Loader.images.buildingShadows[this.owner.name+"_shadow.png"];
    this.movingImg = Loader.images.buildingMoving[this.owner.name+"_moving.png"];
    this.mouseoverImg = Loader.images.icons[this.owner.name+"_icon.png"];
    this.moveImg = Loader.images.default_actions["move.png"];
    this.transparentImg = Loader.images.buildingModes['transparent.png'];
    this.buttonImg = Loader.images.game_elements['button.png'];
    this.mapTiles =[];
    this.staticSprites = {};
    this.progressDisplays = [];
    Object.extend(this.owner,this); 
    
    this.createSprites();
    this.sprites.defaultMove = new DomImgSprite(this.owner, {img: this.moveImg});
    this.sprites.defaultMove.hide();
    
    this.render();
    this.manageStateChange();

  },
  
  createSprites : function(){
    if(this.owner.name == 'townhall'){
    this.sprites.base = new DomImgSprite(this.owner, {img : this.baseImg}, {shiftY: this.zdim, shiftX:-9, divClass: "buildingBase"});
    }
      else{
      this.sprites.base = new DomImgSprite(this.owner, {img : this.baseImg}, {shiftY: this.zdim, divClass: "buildingBase"});
    }
    this.sprites.invalid = new DomImgSprite(this.owner, {img : this.invalidImg}, {shiftY: this.zdim});
    this.sprites.shadow = new DomImgSprite(this.owner, {img: this.shadowImg}, {width:this.shadowImg.width, height:this.shadowImg.height, zIndex :1});
    this.sprites.outline = new DomImgSprite(this.owner, {img: this.outlineImg});
    this.sprites.shadow.shiftX = this.imgWidth - this.shadowImg.width
    this.sprites.shadow.shiftY = this.imgHeight - this.shadowImg.height
    if (this.noOfXTiles == 3) 
      this.sprites.info = new DomTextSprite(this.owner, 'textInfo', {
        centered: true,
        shiftY: -10,
        styleClass: 'buildingName'
      });
    else if(this.noOfXTiles == 2)
      this.sprites.info = new DomTextSprite(this.owner, 'textInfo', {
        centered: true,
        shiftY: -10,
        styleClass: 'buildingName',
        width : 144,
        shiftX : this.owner.imgWidth/2-70
      });
    else
      this.sprites.info = new DomTextSprite(this.owner, 'textInfo', {
        centered: true,
        shiftY: -10,
        styleClass: 'buildingName',
        width : 100,
        shiftX : this.owner.imgWidth/2-50
      }); 
    this.sprites.building = new DomImgSprite(this.owner, {img: this.img});
    this.sprites.building.shiftX = (this.imgWidth - this.img.width)/2;
    this.sprites.base.shiftX = (this.imgWidth - this.img.width)/2+2;
    this.sprites.invalid.shiftX = (this.imgWidth - this.img.width)/2;
    //this.sprites.skeleton = new DomSkeleton(this.owner)
    if(this.movingImg)
      this.sprites.moving = new DomImgSprite(this.owner, {img: this.movingImg});
    this.sprites.clickSprite = new DomImgSprite(this.owner,{img : this.transparentImg, area:this.area}, {clickable: true});
    this.sprites.clickSprite.img.setStyle({width:this.imgWidth+"px",height:this.imgHeight+"px"})
    this.sprites.health = new DomMeterSprite(this.owner,{styleClass:{empty:'healthEmpty',full:'healthFull'},shiftZ:1000})
		this.sprites.underConstruction = new DomImgSprite(this.owner, {img: this.constructionImg}, {shiftY: this.zdim});
    this.sprites.mouseover = new DomImgSprite(this.owner, {img: this.mouseoverImg});
    this.sprites.mouseover.hide();
    this.sprites.defaultMouseover = this.sprites.mouseover;
    this.sprites.neighborMouseover = new DomImgSprite(this.owner, {img: this.transparentImg});
    this.sprites.neighborMouseover.hide();
    if(!this.owner.game.neighborGame)
    {
      this.staticSprites.moreContainer = new DomSpriteContainer(this.owner, {zIndex : this.sprites.clickSprite.minAreaZIndex + 1100,
                                                          width :this.buttonImg.width, height : this.buttonImg.height });
      this.staticSprites.moreContainer.shiftX = (this.imgWidth - this.buttonImg.width)/2+2;
      this.staticSprites.moreContainer.shiftY = this.imgHeight - this.buttonImg.height - 15;
      this.staticSprites.moreButton = this.staticSprites.moreContainer.newDomImgSprite(this.owner, { img: this.buttonImg,
                                                                                         width :this.buttonImg.width,
                                                                                         height : this.buttonImg.height });
      this.owner.moreButtonText = function(){ return "menu"};
      this.staticSprites.moreButtonText = this.staticSprites.moreContainer.newDomTextSprite(this.owner, 'moreButtonText',
                                                      {centered: true, styleClass : 'moreButtonText', divClass : 'moreButtonText',
                                                        width :this.buttonImg.width, height : this.buttonImg.height });
      Map.registerSpecialListeners(this.staticSprites.moreContainer.div, this.owner, 'renderPanel');
    }
    for(var sprite in this.staticSprites){
      this.staticSprites[sprite].render();
    }
  },
  
  manageStateChange : function(){
    var self = this;
    this.owner.stateNotifications[this.owner.states.NOT_PLACED].push(function(){
      if(self.sprites.moving)
      {
        self.sprites.moving.setOpacity(0.5);
        self.sprites.building.hide();
      }
      else
      {
        self.sprites.building.setOpacity(0.5);
        //self.sprites.moving.hide();
      }
      self.sprites.underConstruction.hide();
      self.sprites.building.animated = false;
      self.sprites.base.show();
      self.sprites.outline.hide();
      self.sprites.info.hide();
      if (self.sprites.resourceMeter) {
        self.sprites.resourceMeter.hide()
      }
      if(self.sprites.flag)self.sprites.flag.hide() 
      if(self.sprites.text)self.sprites.text.hide();
      self.sprites.invalid.hide();
      if(self.staticSprites.moreContainer) self.staticSprites.moreContainer.hide();
    });
    this.owner.stateNotifications[this.owner.states.UNDER_CONSTRUCTION].push(function(){
      self.createUnderConstructionElements();
      var top =  self.owner.coords.y
      var left =  self.owner.coords.x -  37; // half width of the progress bar
      self.progressDisplay = new ProgressDisplay(self.owner.nextLevelBluePrints.time, top, left, self.owner.coords.y, 'Building');
      self.progressDisplays.push(self.progressDisplay)
      self.sprites.building.hide();
      self.sprites.shadow.hide();
      self.sprites.underConstruction.show();
      self.sprites.building.animated = false;
      self.sprites.base.hide();
      self.sprites.outline.hide();
      self.sprites.info.hide();
      if(self.sprites.resourceMeter)self.sprites.resourceMeter.hide()
      if(self.sprites.text)self.sprites.text.hide()
      if(self.sprites.flag)self.sprites.flag.hide()
      if(self.sprites.moving) self.sprites.moving.hide();
      self.sprites.invalid.hide();
      if(self.staticSprites.moreContainer) self.staticSprites.moreButton.hide();
    });
    this.owner.stateNotifications[this.owner.states.UPGRADING].push(function(){
      var top =  self.owner.coords.y+Math.round(self.imgHeight/2) - 50
      var left =  self.owner.coords.x - 37;
  	  self.sprites.underConstruction.hide();
      self.progressDisplay = new ProgressDisplay(self.owner.nextLevelBluePrints.time, top -12, left, self.owner.coords.y ,'Upgrading');
      self.progressDisplays.push(self.progressDisplay)
      self.sprites.building.show();
      self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = false;
      self.sprites.base.hide();
      if(self.sprites.flag)self.sprites.flag.show()
      if(self.sprites.resourceMeter)self.sprites.resourceMeter.hide()
      self.sprites.outline.hide();
      self.sprites.info.hide();
      if(self.sprites.text)self.sprites.text.hide()
      if(self.sprites.moving) self.sprites.moving.hide();
      self.sprites.invalid.hide();
      if(self.staticSprites.moreContainer) self.staticSprites.moreButton.hide();
    });
    this.owner.stateNotifications[this.owner.states.NORMAL].push(function(){
      self.sprites.building.show();
      if(self.owner.working)
        self.sprites.building.setOpacity(1);
      else
        self.sprites.building.setOpacity(0.5);
      self.sprites.underConstruction.hide();
      self.sprites.building.animated = true;
      self.sprites.base.hide();
      self.sprites.outline.hide();
      self.sprites.shadow.show();
      self.sprites.info.hide();
      if(self.sprites.resourceMeter) self.sprites.resourceMeter.show()
      if (self.sprites.text) self.sprites.text.hide();
      if(self.sprites.flag) self.sprites.flag.show();
      if(self.sprites.moving) self.sprites.moving.hide();
      self.sprites.invalid.hide();
      if(self.staticSprites.moreContainer) self.staticSprites.moreContainer.hide();
      if(self.staticSprites.moreButton) self.staticSprites.moreButton.show();
      if(self.staticSprites.moreButtonText) self.staticSprites.moreButtonText.show();
    });
  },
  
  renderPanel : function(){
    var rightLimit = this.panelWidth + this.owner.coords.x - Map.x;
    if( rightLimit < Map.viewWidth ) {
      var left = this.owner.coords.x - Map.x;
    } else {
      var left = this.owner.coords.x - Map.x - this.panelWidth;
    }
    var topLimit = this.owner.coords.y - Map.y - Math.round(this.owner.imgHeight / 2);
    if( topLimit > 55 ) {
      var top = this.owner.coords.y - Map.y - Math.round(this.owner.imgHeight / 2);
    } else {
      var top = this.owner.coords.y - Map.y - Math.round(this.owner.imgHeight / 2) + 55;
    }
    $('building-panel').setStyle({
      top: top + "px",
      left: left + "px"
    });
    this.renderPanelButtons();
    $('building-panel').show();
    this.game.buildingMode.selectedBuilding = this;
  },
  
  renderPanelButtons : function(){
    var owner = this.owner;
    $('panel-buttons-container').innerHTML = this.game.templatesManager.load("upgrade-button");
    this.owner.game.addLoadedImagesToDiv('panel-buttons-container')
    this.game.domConverter.convert(this.game.templatesManager.load("move-button"))
    $('panel-buttons-container').appendChild($('move_trigger'));
    $('upgrade_trigger').stopObserving('mousedown');
    $('move_trigger').stopObserving('mousedown');
    $('upgrade_trigger').stopObserving('mouseup');
    $('move_trigger').stopObserving('mouseup');
    $('move_trigger').observe('mousedown',function(){
      $('move_trigger').select("img")[0].setStyle( {marginTop: "-50px"} );
    });
    $('move_trigger').observe('mouseup',function(){
      $('move_trigger').select("img")[0].setStyle( {marginTop: "-25px"} );
      $('building-panel').hide();
      owner.game.buildingMode.move();
      owner.game.buildingMode.moveMode = true;
    })

    if (!owner.isValidToUpgrade(true)) {
      $('upgrade_trigger').select("img")[0].setStyle({marginTop : "-75px"});
      $('upgrade_trigger').setAttribute("disabled", "disabled");
    }else {
      $('upgrade_trigger').observe('mousedown', function(){
      $('upgrade_trigger').select("img")[0].setStyle( {marginTop: "-50px"} );
    });
    $('upgrade_trigger').observe('mouseup',function(){
      $('upgrade_trigger').select("img")[0].setStyle( {marginTop: "-25px"} );
      owner.upgrade();
      $('building-panel').hide();
    })
    }
    this.renderingPanelButtonsDone();
  },
  
  renderingPanelButtonsDone : function(){
    var self = this
    this.registerHoverEvents('upgrade')
    this.registerHoverEvents('move')
  },
  registerHoverEvents : function(elementName){
      var element = $(elementName+'_trigger')
      element.stopObserving("mouseover");
      element.observe("mouseover", function(){
        $$('#panel-buttons-container .panel-button').each(function(div){
         div.removeClassName('hovered')
        })
        element.addClassName('hovered')
        $$('.menuBody .menuItem').each(function(element){
         element.style.visibility = "hidden"
        }) 
        $(elementName+'Desc').style.visibility = "visible"
      });
  },
  
  defaultActionSprite : function(){
    return this.sprites.mouseover;
  },

  defaultNeighborActionSprite : function(){
    return this.sprites.neighborMouseover;
  },
  
  render : function(){
    if((this.owner.state == this.owner.states.NOT_PLACED) || ( this.defaultAction && (this.owner.state == this.owner.states.NORMAL))) {
      this.sprites.clickSprite.setCursor('url(images/buildings/transparent1x1.png), none');
    } else {
      this.sprites.clickSprite.setCursor("pointer");
    }
    if(this.owner.game.neighborGame) {
      this.sprites.defaultMouseover = this.defaultNeighborActionSprite();
    }
    else if( this.owner.game.buildingMode && this.owner.game.buildingMode.moveMode ){
      this.sprites.defaultMouseover = this.sprites.defaultMove;
    } else {
      this.sprites.defaultMouseover = this.defaultActionSprite();
    }
  	if (this.owner.state == this.owner.states.UNDER_CONSTRUCTION) this.renderUnderConstruction();
    if (this.owner.state == this.owner.states.UNDER_CONSTRUCTION || this.owner.state == this.owner.states.UPGRADING) {
      this.sprites.clickSprite.setCursor("default");
      if(this.owner.game.neighborGame)
        this.progressDisplay.hide();
      else
        this.progressDisplay.render( this.owner.elapsedTime() );
    } else if (this.owner.state == this.owner.states.NOT_PLACED) {
      if( this.owner.locationValid ){
        this.sprites.invalid.hide();
      }else{
        this.sprites.invalid.show();
      }
    }
    for(var sprite in this.sprites){
      this.sprites[sprite].render();
    }
    if(this.owner.maxHp >  this.owner.hp)
      this.sprites.health.show();
    else
      this.sprites.health.hide();
  },
  
  destroy : function(){
    for(var sprite in this.sprites){
      this.sprites[sprite].destroy();
    }
  },

  createUnderConstructionElements : function(){
    this.smokes = [];
    this.smokeImg = Loader.images.buildingModes['construction_smoke.png']
    this.smokeElevation = 120;
    
    for (var i = 0; i < this.numberOfSmokes; i++) {
      var smokeSprite = new DomImgSprite(new Bubble(this.owner.coords, this.smokeLargeSizeLimit), {img : this.smokeImg}, {
        shiftY: 0,
        shiftX: this.smokeInitialXShift
      });
      smokeSprite.owner.yMovement = -i*this.smokeElevation /(this.numberOfSmokes);
      smokeSprite.owner.xMovement = this.smokeInitialXShift;
      smokeSprite.setImgWidth(10);
      this.smokes.push(smokeSprite);
    }
  },

  renderUnderConstruction : function(){
    var self = this;
    this.smokes.each(function(smoke){
        smoke.owner.yMovement -= 1;
        if(self.noOfXTiles!=1)smoke.shiftY = smoke.owner.yMovement+self.owner.imgWidth/2-40;
        else smoke.shiftY = smoke.owner.yMovement+self.owner.imgWidth/2+10;
        if (smoke.owner.yMovement < -self.smokeElevation) {
          smoke.owner.reset();
          smoke.owner.xMovement = self.smokeInitialXShift;
          smoke.setImgWidth(10);
          return;
        }        
        var sizeDirection = 1;
        for(var i=0;i<self.smokeElevation/3;i++){
          if (-smoke.owner.yMovement == (i+1)*3) {
            smoke.shiftX = smoke.owner.xMovement-i*1.5/2;
            smoke.img.setOpacity(1 + smoke.owner.yMovement/self.smokeElevation);
            smoke.setImgWidth((i+1)*1.5 + 10);
          }
        }
        smoke.show();
        smoke.render();
    })
  }
  
});

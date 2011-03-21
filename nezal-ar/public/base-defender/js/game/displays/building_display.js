var BuildingDisplay = Class.create(Display, {
  panelWidth : 210,
  initialize : function($super,owner,properties){
    $super(owner,properties)
    this.noOfXTiles = Math.ceil(this.xdim / Map.tileIsoLength)
    this.noOfYTiles = Math.ceil(this.ydim / Map.tileIsoLength)
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

    var buildImgName = this.noOfXTiles+"x"+this.noOfYTiles
    this.invalidImg =  Loader.images.buildingModes[buildImgName+"_invalid.png"];
    this.baseImg = Loader.images.buildingModes[buildImgName+'_base.png'];
    this.shadowImg = Loader.images.buildingShadows[this.owner.name+"_shadow.png"];
    this.movingImg = Loader.images.buildingMoving[this.owner.name+"_moving.png"];
    this.mouseoverImg = Loader.images.icons[this.owner.name+"_icon.png"];
    this.transparentImg = Loader.images.buildingModes['transparent.png'];
    this.mapTiles =[];
    Object.extend(this.owner,this); 
    this.createSprites()  
    this.render();
    this.manageStateChange();
  },
  
  createSprites : function(){
    this.sprites.base = new DomImgSprite(this.owner, {img : this.baseImg}, {shiftY: this.zdim});
    this.sprites.invalid = new DomImgSprite(this.owner, {img : this.invalidImg}, {shiftY: this.zdim});
    this.sprites.shadow = new DomImgSprite(this.owner, {img: this.shadowImg, width:this.shadowImg.width,
    height:this.shadowImg.height});
    this.sprites.outline = new DomImgSprite(this.owner, {img: this.outlineImg});
    this.sprites.health = new DomHealthSprite(this.owner)
    this.sprites.shadow.shiftX = this.imgWidth - this.shadowImg.width
    this.sprites.shadow.shiftY = this.imgHeight - this.shadowImg.height
    this.sprites.info = new DomTextSprite(this.owner, 'textInfo', {centered: true, shiftY: -10});
    this.sprites.building = new DomImgSprite(this.owner, {img: this.img});
    this.sprites.building.shiftX = (this.imgWidth - this.img.width)/2+2;
    this.sprites.base.shiftX = (this.imgWidth - this.img.width)/2+2;
    this.sprites.invalid.shiftX = (this.imgWidth - this.img.width)/2+2;
        this.sprites.mouseover = new DomImgSprite(this.owner, {img: this.mouseoverImg});
    //this.sprites.skeleton = new DomSkeleton(this.owner)
    if(this.movingImg)
      this.sprites.moving = new DomImgSprite(this.owner, {img: this.movingImg});
    this.sprites.clickSprite = new DomImgSprite(this.owner,{img : this.transparentImg, area:this.area}, {clickable: true});
    this.sprites.clickSprite.img.setStyle({width:this.imgWidth+"px",height:this.imgHeight+"px"})
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
      self.sprites.building.animated = false;
      self.sprites.base.show();
      self.sprites.outline.hide();
      self.sprites.info.hide();
      if(self.sprites.text)self.sprites.text.hide()
      self.sprites.mouseover.hide();
      self.sprites.invalid.hide();
    });
    this.owner.stateNotifications[this.owner.states.UNDER_CONSTRUCTION].push(function(){
      var top =  self.owner.coords.y -Math.round(self.imgHeight/2)
      var left =  self.owner.coords.x -48; // half width of the progress bar
      self.progressDisplay = new ProgressDisplay( self.owner.nextLevelBluePrints.time, top - 12, left, self.owner.coords.y );
      self.sprites.building.show();
      self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = false;
      self.sprites.base.hide();
      self.sprites.outline.hide();
      self.sprites.info.hide();
      if(self.sprites.text)self.sprites.text.hide()
      self.sprites.mouseover.hide();
      if(self.sprites.moving) self.sprites.moving.hide();
      self.sprites.invalid.hide();
    });
    this.owner.stateNotifications[this.owner.states.UPGRADING].push(function(){
      var top =  self.owner.coords.y -Math.round(self.imgHeight/2)
      var left =  self.owner.coords.x - 48;
      self.progressDisplay = new ProgressDisplay( self.owner.nextLevelBluePrints.time, top -12, left, self.owner.coords.y );
      self.sprites.building.show();
      self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = false;
      self.sprites.base.hide();
      self.sprites.outline.hide();
      self.sprites.info.hide();
      if(self.sprites.text)self.sprites.text.hide()
      self.sprites.mouseover.hide();
      if(self.sprites.moving) self.sprites.moving.hide();
      self.sprites.invalid.hide();
    });
    this.owner.stateNotifications[this.owner.states.NORMAL].push(function(){
      self.sprites.building.show();
      if(self.owner.working)
        self.sprites.building.setOpacity(1);
      else
        self.sprites.building.setOpacity(0.5);
      self.sprites.building.animated = true;
      self.sprites.base.hide();
      self.sprites.outline.hide();
      self.sprites.info.hide();
      if (self.sprites.text) {
        self.sprites.text.hide()
      }
      self.sprites.mouseover.hide();
      if(self.sprites.moving) self.sprites.moving.hide();
      self.sprites.invalid.hide();
    });
  },
  
  renderPanel : function(){
    
    var rightLimit = this.panelWidth + this.owner.coords.x - Map.x + Math.round(this.owner.imgWidth / 2);
    if( rightLimit < Map.viewWidth ) {
      var left = this.owner.coords.x - Map.x + Math.round(this.owner.imgWidth / 2);
    } else {
      var left = this.owner.coords.x - Map.x - this.panelWidth - Math.round(this.owner.imgWidth / 2);
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
  },
  
  renderPanelButtons : function(){
    var owner = this.owner;
    
    $('panel-buttons-container').innerHTML = this.game.templatesManager.upgradeButton();
    $('upgrade_trigger').stopObserving('click');
    $('upgrade_trigger').observe('click', function(){
      owner.upgrade();
      owner.game.selectedBuildingPanel.hide();
    });
  },
  
  render : function(){
    if (this.owner.state == this.owner.states.UNDER_CONSTRUCTION || this.owner.state == this.owner.states.UPGRADING ) {
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
  }
  
});

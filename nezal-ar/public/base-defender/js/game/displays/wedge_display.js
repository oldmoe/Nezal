var WedgeDisplay = Class.create(BuildingDisplay, {

  weaponDisplay : null,

  container : null,

  initialize : function($super,owner,properties){
    $super(owner,properties)
    var self = this;
    this.owner.weapon.container = this.container;
    this.owner.weapon.display = new SlingshotDisplay(this.owner.weapon, properties);
  },

  createSprites : function(){
    this.container = new DomSpriteContainer(this.owner)
		this.sprites.base = this.container.newDomImgSprite(this.owner, {img : this.baseImg, width:this.width}, {shiftY: this.zdim, divClass: "buildingBase"});
		this.sprites.invalid = this.container.newDomImgSprite(this.owner, {img : this.invalidImg, width:this.width}, {shiftY: this.zdim});
		this.sprites.shadow = this.container.newDomImgSprite(this.owner, {img: this.shadowImg, width:this.shadowImg.width,
                                                      		height:this.shadowImg.height, zIndex : 1});
		this.sprites.outline = this.container.newDomImgSprite(this.owner, {img: this.outlineImg, zIndex : 1});
		this.sprites.building = this.container.newDomImgSprite(this.owner, {img: this.img});
		this.sprites.health = new DomMeterSprite(this.owner,{styleClass:{empty:'healthEmpty',full:'healthFull'},'width':50})
		//this.sprites.skeleton = new DomSkeleton(this.owner)
		this.sprites.health.shiftY = -20
    this.sprites.info = new DomTextSprite(this.owner, 'textInfo', {centered: true, shiftY: -30, styleClass : 'buildingName'});
		this.sprites.building.shiftX = (this.imgWidth - this.img.width)/2;
		this.sprites.shadow.shiftX = this.imgWidth - this.shadowImg.width;
		this.sprites.shadow.shiftY = this.imgHeight - this.shadowImg.height;
		this.sprites.base.shiftX = (this.imgWidth - this.img.width)/2;  
		this.sprites.base.setImgWidth(this.imgWidth);
		this.sprites.invalid.shiftX = (this.imgWidth - this.img.width)/2;
		this.sprites.invalid.setImgWidth(this.imgWidth);
    if(this.movingImg)
      this.sprites.moving = this.container.newDomImgSprite(this.owner, {img: this.movingImg});
		this.sprites.clickSprite = new DomImgSprite(this.owner,{img : this.transparentImg, area:this.area}, {clickable: true});
		this.sprites.clickSprite.img.setStyle({width:this.imgWidth+"px",height:this.imgHeight+"px"})
    this.sprites.mouseover = new DomImgSprite(this.owner, {img: this.mouseoverImg});
	this.sprites.underConstruction = new DomImgSprite(this.owner, {img: this.constructionImg}, {shiftY: this.zdim})
    this.container.render();
  },

   manageStateChange : function($super){
    $super()
    var self = this;
	this.owner.stateNotifications[this.owner.states.NOT_PLACED].push(function(){
      self.sprites.moving.show();
    });
    this.owner.stateNotifications[this.owner.states.UNDER_CONSTRUCTION].push(function(){
      self.owner.weapon.container.hide();
    });
    this.owner.stateNotifications[this.owner.states.UPGRADING].push(function(){
      self.sprites.building.setOpacity(1);
	  self.owner.weapon.container.show()
      self.owner.weapon.container.setOpacity(0.5);
    });
    this.owner.stateNotifications[this.owner.states.NORMAL].push(function(){
	  self.owner.weapon.container.show()
      if(self.owner.working)
      {
        self.sprites.building.setOpacity(1);
        self.owner.weapon.container.setOpacity(1);
      }
      else
      {
        self.sprites.building.setOpacity(1);
        self.owner.weapon.container.setOpacity(0.5);
      }
    });
  },

  render : function($super) {
    $super();
    if( this.owner.owner.state == this.owner.owner.states.NOT_PLACED  && this.owner.weapon.container)
    {
      this.owner.weapon.container.render();
    }
  },

  renderPanel: function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
  }, 

  destroy : function($super) {
    $super();
    this.owner.weapon.display.destroy();
    this.owner.weapon.container.destroy();
  }
});

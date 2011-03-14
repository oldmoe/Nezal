var ChildDomSprite = Class.create(DomImgSprite, {

  container : null,
  zIndex : 3,

  initialize : function($super, owner, assets, properties){
    if( assets && assets.container )
    {
      this.container = assets.container;
      if( assets.zIndex )
        this.zIndex = assets.zIndex;
    }else
      this.container = $('gameCanvas');
    $super(owner, assets, properties);
  },

  createDiv : function() {  
    this.div = $(document.createElement('DIV'));
    this.container.appendChild(this.div);
  },

  position : function() {
    var position = {};
    position.x = 0;
    position.y = 0;
    position.zIndex = this.zIndex;
    return position;
  },

  setZIndex : function(zIndex){
    this.zIndex = zIndex;
  }

});

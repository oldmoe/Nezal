var ChildDomTextSprite = Class.create(DomTextSprite, {

 initialize : function($super, owner, textAssets, properties){
    if( properties && properties.container )
    {
      this.container = properties.container;
      if( properties.zIndex )
        this.zIndex = properties.zIndex;
    }else
      this.container = $('gameCanvas');
    $super(owner, textAssets, properties);
  },

  createDiv : function() {  
    this.div = $(document.createElement('DIV'))
    this.container.appendChild(this.div);
  },

  position : function() {
    var position = {};
    position.x = 0;
    position.y = 0;
    position.zIndex = this.zIndex;
    return position;
  }

});

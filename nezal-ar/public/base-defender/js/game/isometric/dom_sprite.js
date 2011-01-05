var DomSprite = Class.create(Sprite, {
  shiftX : 0,
  shiftY : 0,
  initialize : function(owner, assets, properties){
    this.div = $(document.createElement('DIV'));
    $('gameCanvas').appendChild(this.div);
    this.div.addClassName('DomSprite');
    this.owner = owner;
    this.div.setStyle ({zIndex :(this.owner.coords.y + this.owner.zdim)});
    this.div.style.width = this.owner.imgWidth + "px";
    this.div.style.height =  this.owner.imgHeight + "px";
  },
  
  setStyle : function(style){
    this.div.setStyle(style)
  },
  
  setOpacity : function(opacity){
    this.div.setOpacity(opacity)
  },
  
  show : function(){
    this.visible = true
    this.div.show()
    return this
  },
  
  hide : function(){
    this.visible = false
    this.div.hide()
    return this
  },

  render : function(){
    return Nezal.notImplemented()();
  },
  
  destroy : function(){
    if(this.div.parentNode){
      this.div = $(this.div.parentNode.removeChild(this.div))
    }
  }
})
var DomSprite = Class.create(Sprite, {
  shiftX : 2,
  shiftY : 2,
  initialize : function(owner, assets, properties){
    this.div = $(document.createElement('DIV'));
    $('gameCanvas').appendChild(this.div);
    this.div.addClassName('DomSprite');
    this.owner = owner;
    this.div.setStyle ({zIndex :(this.owner.coords.y + this.owner.zdim)});
		if(assets && assets.width)this.div.style.width = assets.width + "px";
    else this.div.style.width = this.owner.imgWidth + "px";
		if(assets && assets.height)this.div.style.height = assets.height + "px";
    else this.div.style.height =  this.owner.imgHeight + "px";
    Object.extend( this, properties );
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
    try{
      if(this.owner.dead){
        return this.destroy()
      }
      
      if (this.visible) {
        
        this.div.setStyle({
          left: this.owner.coords.x - Math.round(this.owner.imgWidth / 2) + this.shiftX + "px",
          top: this.owner.coords.y - Math.round(this.owner.imgHeight / 2) + this.shiftY + "px",
          zIndex: this.owner.coords.y
        });
      }
  
    }catch(e){
      //console.log('Sprite#render: ',e)
    }
  },
  
	destroy : function(){
		if(this.div.parentNode){
			this.div = $(this.div.parentNode.removeChild(this.div))
		}
	}
	
})
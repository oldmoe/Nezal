var DomSprite = Class.create(Sprite, {
  shiftX : 2,
  shiftY : 2,
  shiftZ : 0,
  initialize : function(owner, assets, properties){
  	properties = properties || {}
    this.createDiv();
    this.div.addClassName('DomSprite');
    this.owner = owner;
	var z =0 ;
	if(assets && assets.zIndex){
		z = assets.zIndex
		this.zIndex = z
	}  
	else var z = this.owner.coords.y + this.owner.zdim
    this.div.setStyle ({zIndex :(z)});
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
        var position = this.position();
        this.div.setStyle({
          left: position.x + this.shiftX + "px",
          top: position.y + this.shiftY + "px",
          zIndex: position.zIndex
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
	},

  position : function(){
    var position = {};
    position.x = Math.round(this.owner.coords.x - Math.round(this.owner.imgWidth / 2));
    position.y = Math.round(this.owner.coords.y - Math.round(this.owner.imgHeight / 2));
	if(this.zIndex) position.zIndex = this.Index 
    else position.zIndex = this.owner.coords.y + this.owner.zdim + this.shiftZ;
    return position;
  },

  createDiv : function() {
    this.div = $(document.createElement('DIV'));
    $('gameCanvas').appendChild(this.div);
  },
	
})

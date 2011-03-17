var DomSkeleton = Class.create(DomSprite, {
  shiftX : 0,
  shiftY : 0,
  initialize : function(owner, assets, properties){
    this.createDiv();
    this.div.addClassName('DomSprite');
    this.owner = owner;
    this.div.setStyle ({zIndex :(this.owner.coords.y + this.owner.zdim)});
		if(assets && assets.width)this.div.setAttribute('width', assets.width);
    else this.div.setAttribute('width', this.owner.imgWidth);
		if(assets && assets.height)this.div.setAttribute('height',assets.height);
    else this.div.setAttribute('height', this.owner.imgHeight )
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
				var left = Math.sin(Util.degToRad(Map.tileAngle))* this.owner.xdim
				var right = Math.sin(Util.degToRad(Map.tileAngle))* this.owner.ydim
				this.ctx.beginPath();
				
//				this.ctx.moveTo(this.owner.imgWidth/4,this.owner.zdim+left/2)
//				this.ctx.lineTo(this.owner.imgWidth*3/4,this.owner.zdim+right/2)
//				this.ctx.lineTo(this.owner.imgWidth*3/4,right*3/2+this.owner.zdim)
//				this.ctx.lineTo(this.owner.imgWidth/4,this.owner.zdim+left*3/2)
//				this.ctx.lineTo(this.owner.imgWidth/4,this.owner.zdim+left/2)

				this.ctx.lineTo(0,left)
				this.ctx.lineTo(Math.round(this.owner.imgWidth/2),2*left)
				this.ctx.lineTo(this.owner.imgWidth,right)
				this.ctx.lineTo(this.owner.imgWidth,right+this.owner.zdim)
				this.ctx.lineTo(Math.round(this.owner.imgWidth/2),this.owner.zdim);
				this.ctx.lineTo(0,left + this.owner.zdim);
				this.ctx.lineTo(Math.round(this.owner.imgWidth/2),2*left+this.owner.zdim)
				this.ctx.lineTo(this.owner.imgWidth,right+this.owner.zdim)
				this.ctx.moveTo(Math.round(this.owner.imgWidth/2),0);
				this.ctx.lineTo(Math.round(this.owner.imgWidth/2),this.owner.zdim);
				this.ctx.moveTo(Math.round(this.owner.imgWidth/2),0);
				this.ctx.lineTo(Math.round(this.owner.imgWidth/2),this.owner.zdim);
				this.ctx.moveTo(Math.round(this.owner.imgWidth/2),0);
				this.ctx.lineTo(this.owner.imgWidth,right)
				this.ctx.moveTo(0,left);
				this.ctx.lineTo(0,left + this.owner.zdim);
				this.ctx.closePath()
				this.ctx.stroke();
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
    position.x = this.owner.coords.x - Math.round(this.owner.imgWidth / 2);
    position.y = this.owner.coords.y - Math.round(this.owner.imgHeight / 2);
    position.zIndex = this.owner.coords.y + this.owner.zdim;
    return position;
  },

  createDiv : function() {
    this.div = $(document.createElement('canvas'));
		this.ctx = this.div.getContext('2d');
		this.div.addClassName("canvas")
    $('gameCanvas').appendChild(this.div);
  },
	
})

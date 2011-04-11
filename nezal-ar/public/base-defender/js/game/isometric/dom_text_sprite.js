var DomTextSprite = Class.create(DomSprite, {
  centered : true,
  minZIndex : 10000,  
  initialize : function($super, owner, textAssets, properties){
    $super(owner, textAssets, properties);
	this.div.style.display = "none"
    this.textAssets = textAssets;
    this.span = $(document.createElement('SPAN'));
    this.div.appendChild(this.span);
    this.span.innerHTML = this.owner[textAssets]();
    if( this.centered ){
      this.div.setStyle({textAlign: "center"});
    }
  },
  
  render : function($super){
    $super();
    try{
      if(this.owner.dead){
        return this.destroy();
      }
      this.span.innerHTML = this.owner[this.textAssets]();
      this.div.setStyle({left : this.owner.coords.x -Math.round(this.owner.imgWidth/2)+this.shiftX + "px",
                         top : this.owner.coords.y -Math.round(this.owner.imgHeight/2)+this.shiftY + "px",
                         zIndex : this.minZIndex + this.owner.coords.y, height : 40+"px"});
      this.span.setStyle({                  
                         marginLeft :(-this.owner.imgWidth*this.owner.angle  + "px"),
                         marginTop : (-this.currentAnimationFrame * this.owner.imgHeight + "px")})
  		 				this.span.addClassName('DomTxtSprite');
    }catch(e){
 //     console.log('Sprite#render: ',e)
    }
  },
  
  show : function(){
  	if(this.effect)this.effect.cancel()
  	this.effect = Effect.Appear(this.div, {duration : 0.25})
  	return this
  },
  
  hide : function(){
  	if(this.effect)this.effect.cancel()
  	this.effect = Effect.Fade(this.div, {duration : 0.25})
  	return this
  }
  
})

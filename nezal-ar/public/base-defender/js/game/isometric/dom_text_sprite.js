var DomTextSprite = Class.create(DomSprite, {
  centered : true,
  minZIndex : 10000,  
  initialize : function($super, owner, textAssets, properties){
    $super(owner, properties, properties);
  	this.div.style.display = "none"
    this.textAssets = textAssets;
    this.span = $(document.createElement('SPAN'));
    this.div.appendChild(this.span);
    this.span.innerHTML = this.owner[textAssets]();
    if( this.centered ){
      this.div.setStyle({textAlign: "center"});
    }
    if( this.zIndex ){
      this.minZIndex = this.zIndex
    }
    if(!this.styleClass)
    {
      this.styleClass = 'DomTxtSprite';
    }
  },
  
  render : function($super){
    $super();
    try{
      if(this.owner.dead){
        return this.destroy();
      }
      this.span.innerHTML = this.owner[this.textAssets]();
      var position = this.position();
      this.div.setStyle({ left : position.x + this.shiftX + "px",
                          top :  position.y + this.shiftY +"px",
                          zIndex : this.minZIndex + this.owner.coords.y, 
                          height : 40+"px"});
      this.span.setStyle({                  
                         marginLeft :(-this.owner.imgWidth*this.owner.angle  + "px"),
                         marginTop : (-this.currentAnimationFrame * this.owner.imgHeight + "px")})
      this.span.addClassName(this.styleClass);
    }catch(e){
 //     console.log('Sprite#render: ',e)
    }
  },
  
  show : function(){
  	if(this.effect)this.effect.cancel()
  	this.effect = new Effect.Appear(this.div, {duration : 0.25})
  	return this
  },
  
  hide : function(){
  	if(this.effect)this.effect.cancel()
  	this.effect = new Effect.Fade(this.div, {duration : 0.25})
  	return this
  }
  
})

var DomTextSprite = Class.create(DomSprite, {
  centered : true,
  minZIndex : 10000,  
  initialize : function($super, owner, textAssets, properties){
    $super(owner, properties, properties);
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
    this.span.addClassName(this.styleClass);
//    this.span.addClassName('smallBlackOutline');
    this.render()
  },
  
  render : function($super){
    $super();
    try{
      if(this.owner.dead){
        return this.destroy();
      }
      this.span.innerHTML = this.owner[this.textAssets]();
      this.div.setStyle({height : 40+"px"});
      this.span.setStyle({                  
                         marginLeft :(-this.owner.imgWidth*this.owner.angle  + "px"),
                         marginTop : (-this.currentAnimationFrame * this.owner.imgHeight + "px")})
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

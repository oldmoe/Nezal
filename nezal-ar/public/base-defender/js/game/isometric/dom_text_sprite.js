var DomTextSprite = Class.create(DomSprite, {
  centered : true,
  
  initialize : function($super, owner, textAssets, properties){
    $super(owner, textAssets, properties);
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
                         zIndex : this.owner.coords.y});
      this.span.setStyle({                  
                         marginLeft :(-this.owner.imgWidth*this.owner.angle  + "px"),
                         marginTop : (-this.currentAnimationFrame * this.owner.imgHeight + "px")})
  
    }catch(e){
 //     console.log('Sprite#render: ',e)
    }
  }
})
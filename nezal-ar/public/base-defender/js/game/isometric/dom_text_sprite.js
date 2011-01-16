var DomTextSprite = Class.create(DomSprite, {
  centered : true,
  
  initialize : function($super, owner, textAssets, properties){
    $super(owner, textAssets, properties);
    this.span = $(document.createElement('SPAN'));
    this.div.appendChild(this.span);
    this.span.innerHTML = textAssets.text;
    if( this.centered ){
      this.div.setStyle({textAlign: "center"});
    }
  },
  
  render : function($super){
    $super();
//    this.span.setStyle({
//      marginLeft: (-this.owner.imgWidth * this.owner.angle + "px"),
//      marginTop: (-this.currentAnimationFrame * this.owner.imgHeight + "px")
//    });
  }
  
})
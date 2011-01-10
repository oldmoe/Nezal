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
    if(this.visible)
      console.log("dom_sprite", this.owner.coords.x - Math.round(this.owner.imgWidth / 2), this.owner.coords.y - Math.round(this.owner.imgHeight / 2))
  }
  
})
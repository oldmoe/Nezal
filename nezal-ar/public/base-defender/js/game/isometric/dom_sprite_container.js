var DomSpriteContainer = Class.create(DomSprite, {

  div : null, 

  initialize : function($super, owner, assets, properties){
    $super(owner, assets, properties);
    this.div.addClassName('DomSpriteContainer');
  },

  newDomTextSprite : function(owner, assets, properties){
    if(!properties)  properties = {};
    properties.container = this.div;
    return new ChildDomTextSprite(owner, assets, properties);
  },

  newDomImgSprite : function(owner, assets, properties){
    if(!assets)  assets = {};
    assets.container = this.div;
    return new ChildDomImgSprite(owner, assets, properties);
  }

});

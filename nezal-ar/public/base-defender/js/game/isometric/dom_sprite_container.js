var DomSpriteContainer = Class.create(DomSprite, {

  div : null, 

  initialize : function($super, owner, assets, properties){
    $super(owner, assets, properties);
    this.div.addClassName('DomSpriteContainer');
  },

  newDomSprite : function(owner, assets, properties){
    if(!assets)  assets = {};
    assets.container = this.div;
    return new ChildDomSprite(owner, assets, properties);
  },

  newDomImgSprite : function(owner, assets, properties){
    if(!assets)  assets = {};
    assets.container = this.div;
    return new ChildDomSprite(owner, assets, properties);
  },

});

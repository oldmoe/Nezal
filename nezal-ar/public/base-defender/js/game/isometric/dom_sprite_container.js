var DomSpriteContainer = Class.create(DomSprite, {

  div : null, 

  initialize : function($super, owner, properties){
    $super(owner, null, properties);
    this.div.addClassName('DomSpriteContainer');
  },

  newDomTextSprite : function(owner, assets, properties){
    if(!properties)  properties = {};
    properties.container = this.div;
    return new ChildDomTextSprite(owner, assets, properties);
  },

  newDomImgSprite : function(owner, assets, properties,name){
    if(!assets)  assets = {};
    assets.container = this.div;
    var sprite =  new ChildDomImgSprite(owner, assets, properties,name);
    return sprite
  }

});

var Wedge = Class.create(Building, {
  
  weapon : null,

  shot : "rock",

  initialize : function($super, factory, buildingSpecs) {
    $super(factory, buildingSpecs);
    this.weaponClass = eval(this.currentLevelBluePrints["weapon"].dasherize().capitalize().camelize())
    this.weapon = new this.weaponClass(this.currentLevelBluePrints["weapon"], this);
  }

});

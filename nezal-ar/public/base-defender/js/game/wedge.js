var Wedge = Class.create(Building, {
  
  weapon : null,

  initialize : function($super, factory, buildingSpecs) {
    $super(factory, buildingSpecs);
    this.weapon = new Weapon(this.currentLevelBluePrints["weapon"], this);
    console.log(this)
  }

});

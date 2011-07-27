var Townhall = Class.create(Building, {
  producing : false,
  initialize: function($super, factory, buildingSpecs){
  	$super(factory,buildingSpecs)
	this.storageCapacity = game.data.buildings.townhall.levels[this.level].storageCapacity
  }
});

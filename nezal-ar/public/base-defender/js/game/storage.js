var Storage = Class.create(Building, {
  initialize: function($super, factory, buildingSpecs){
  	$super(factory,buildingSpecs)
	  this.storageCapacity = game.data.buildings.storage.levels[this.level].storageCapacity
  }
});
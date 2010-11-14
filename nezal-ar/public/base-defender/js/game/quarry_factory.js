var QuarryFactory = Class.create(BuildingFactory, {
  name : "quarry",
  canBeBuiltOn : "rock",
  buildingClass : Quarry,
  
  newQuarry : function(){
    return this.newBuilding();
  }
});
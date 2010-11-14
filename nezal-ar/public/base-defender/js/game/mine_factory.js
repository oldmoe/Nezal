var MineFactory = Class.create(BuildingFactory, {
  name : "mine",
  canBeBuiltOn : "iron",
  buildingClass : Mine,
  
  newMine : function(){
    return this.newBuilding();
  }
  
});
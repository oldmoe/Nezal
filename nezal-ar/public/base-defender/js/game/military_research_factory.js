var MilitaryResearchFactory = Class.create(BuildingFactory, {
  name : "military_research",
  canBeBuiltOn : "grass",
  buildingClass : MilitaryResearch,
  factoryRegistry : {}, 
  initialize : function($super, game){
    $super(game);
  },
  
  newMilitaryResearch : function(){
    return this.newBuilding();
  }
  
});

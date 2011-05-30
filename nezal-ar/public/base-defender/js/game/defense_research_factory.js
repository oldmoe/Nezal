var DefenseResearchFactory = Class.create(BuildingFactory, {
  name : "defense_research",
  canBeBuiltOn : "grass",
  buildingClass : DefenseResearch,
  factoryRegistry : {}, 
  initialize : function($super, game){
    $super(game);
  },
  
  newDefenseResearch : function(){
    return this.newBuilding();
  }
  
});

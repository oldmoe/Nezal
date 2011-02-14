var DefenseCenterFactory = Class.create(BuildingFactory, {
  name : "defense_center",
  canBeBuiltOn : "grass",
  buildingClass : DefenseCenter,
  factoryRegistry : {}, 
  initialize : function($super, game){
    $super(game);
  },
  
  newDefenseCenter : function(){
    return this.newBuilding();
  }
  
});
var BuildingPanel = Class.create(MenuPanel, {
  selectedBuilding : null,
  
  initialize : function($super, buidling, templater){
    $super("building", templater);
    this.selectedBuilding = buidling;
  } 
})

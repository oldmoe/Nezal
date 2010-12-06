var BuildingPanel = Class.create({
  selectedBuilding : null,
  
  initialize : function(buidling, templater){
    this.selectedBuilding = buidling;
    $('building-panel-contents').innerHTML = templater();
  },
  
  hide : function(){
    $('building-panel').hide();
  }
})
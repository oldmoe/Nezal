var BuildingPanel = Class.create({
  selectedBuilding : null,
  
  initialize : function(buidling, templater){
    this.selectedBuilding = buidling;
    if( !$$("#building-panel #close-building-panel")[0] ){
      
      this.closeDomArea = new DomArea({
        useMapId : "close-building-panel",
        shape : 'circle',
        coords : "12,12,12",
        parentDiv : $("building-panel"),
        mapParentDiv : $("building-panel"),
        size : {
          width: 24,
          height: 24
        },
        areaID : "close-building-panel",
        transparentImageStyle : {
          position: "absolute",
          right: 0,
          top: 0
        }
      });
      
      //this.closeDomArea.area.setAttribute("id", "close-building-panel");
      this.closeDomArea.area.setStyle({cursor : "pointer"});
    }
    
    this._AttachBuildingPanelCloseListeners();
    $('building-panel-contents').innerHTML = templater();
  },
  
  _AttachBuildingPanelCloseListeners : function(){
    var self = this;
    var closeCallback = function(){
      $('building-panel').hide();
      game.selectedBuildingPanel = null;
	  game.buildingMode.selectedBuilding = null;
      this.selectedBuilding = null;
    }
    
    $('close-building-panel').observe(game.mouseClickEvent, closeCallback);
    document.observe('keydown', function(event){
      if (event.keyCode == Event.KEY_ESC) {
        closeCallback();
      }
    });
  },
  
  hide : function(){
    $('building-panel').hide();
  },
	
	render : function(){
		
	} 
})

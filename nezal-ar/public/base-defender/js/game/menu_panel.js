var MenuPanel = Class.create({
  
  initialize : function(name, templater, templatingCallback){
    this.name = name;
    if( !$$("#" + name + "-panel #close-" + name + "-panel")[0] ){
      
      this.closeDomArea = new DomArea({
        useMapId : "close-" + name + "-panel",
        shape : 'circle',
        coords : "12,12,12",
        parentDiv : $(name + "-panel"),
        mapParentDiv : $(name + "-panel"),
        size : {
          width: 24,
          height: 24
        },
        areaID : "close-" + name + "-panel",
        transparentImageStyle : {
          position: "absolute",
          right: 0,
          top: 0
        }
      });
      
      this.closeDomArea.area.setStyle({cursor : "pointer"});
    }
    
    this._AttachPanelCloseListeners();
    $(name + '-panel-contents').innerHTML = templater();
    if(templatingCallback) templatingCallback();
  },
  
  _AttachPanelCloseListeners : function(){
    var self = this;
    var closeCallback = function(){
      $(self.name + '-panel').hide();
      if(self.name == "building") {
        game.selectedBuildingPanel = null;
        game.buildingMode.selectedBuilding = null;
        self.selectedBuilding = null;
      }
    }
    
    $('close-' + this.name + '-panel').observe(game.mouseClickEvent, closeCallback);
    document.observe('keydown', function(event){
      if (event.keyCode == Event.KEY_ESC) {
        closeCallback();
      }
    });
  },
  
  hide : function(){
    $(this.name + '-panel').hide();
  },
  
  render : function(){
    $(this.name + '-panel').show();
  } 
})

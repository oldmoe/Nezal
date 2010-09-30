var Townhall = Class.create({
  name : "townhall",
  level : null,
  inProgress : null,
  startedBuildingAt : null,
  
  initialize : function(townhall_json){
    this.level = townhall_json.level;
    this.inProgress = townhall_json.inProgress;
    this.startedBuildingAt = townhall_json.startedBuildingAt;
    
  },
  
  build : function(x, y){
    /*
     new Ajax.Request('metadata', {
     method : 'post',
     parameters: { 'data' : Object.toJSON(
     { 'event' :'upgrade',
     'building' : 'townhall',
     'coords' : {'x' : null, 'y' : null} })
     },
     onSuccess: function(response) {
     gameStatus = JSON.parse(response.responseText)
     }
     });*/
  }
});
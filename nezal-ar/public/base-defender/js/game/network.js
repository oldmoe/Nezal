var Network = Class.create({
  initializeGame : function(){
    var gameStatus = null;
    new Ajax.Request('metadata', {
      method : 'get',
      asynchronous : false,
      onSuccess: function(response) {
        gameStatus = JSON.parse(response.responseText)
      }
    });
    return gameStatus;
  },
  
  contactTheBoss : function(params){
    var done = true;
    var gameStatus = null;
    new Ajax.Request('metadata', {
      method : 'post',
      asynchronous : false,
      parameters: { 'data' : Object.toJSON(params)},
      onSuccess: function(response) {
        gameStatus = JSON.parse(response.responseText);
        userProfile = JSON.parse(gameStatus.user_data.metadata);
        if (userProfile['error']) {
          alert("The server refused to do your action, what have you did?, ya la2eem ;), message : " + userProfile['error']);
          done = false;
        }
      }
    });
    return {'done' : done, 'gameStatus' : gameStatus};
  },
  
  upgradeBuilding : function(name, coords){
    return this.contactTheBoss({ 'event' :'upgrade', 'building' : name, 'coords' : coords });
  },
  
  buyWorker : function(){
    return this.contactTheBoss({ 'event' :'buy_worker'});
  },
  
  fetchTemplate : function(path, callBack){
    new Ajax.Request(path, {
      method : 'get',
      asynchronous : false,
      onSuccess: function(response) {
        callBack(response.responseText);
      }
    })
  }
});
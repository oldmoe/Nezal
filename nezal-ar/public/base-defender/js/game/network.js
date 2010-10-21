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
  upgradeBuilding : function(name, coords){
    var upgradeDone = true;
    var gameStatus = null;
    new Ajax.Request('metadata', {
      method : 'post',
      asynchronous : false,
      parameters: { 'data' : Object.toJSON({ 'event' :'upgrade', 'building' : name, 'coords' : coords })},
      onSuccess: function(response) {
        gameStatus = JSON.parse(response.responseText);
        userProfile = JSON.parse(gameStatus.user_data.metadata);
        if (userProfile['error']) {
          alert("The server refused to build the townhall, what have you did?, ya la2eem ;), message : " + userProfile['error']);
          upgradeDone = false;
        }
        else {
          self.startedBuildingAt = new Date().getTime();
          self.inProgress = true;
        }
      }
    });
    return {'upgradeDone' : upgradeDone, 'gameStatus' : gameStatus};
  }
});
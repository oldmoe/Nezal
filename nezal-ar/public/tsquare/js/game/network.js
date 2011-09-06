var Network = Class.create({

  initializeGame : function(callback){
    new Ajax.Request('data', {
      method : 'get',
      //asynchronous : false,
      onSuccess: function(response) {
        var gameStatus = JSON.parse(response.responseText);
        if(callback) callback( gameStatus );
      }
    });
  },
  
  contactTheBoss : function(params, callback){
    var done = true;
    var gameStatus = null;
    new Ajax.Request('data', {
      method : 'post',
      //asynchronous : false,
      parameters: { 'data' : Object.toJSON(params)},
      onSuccess: function(response) {
        gameStatus = JSON.parse(response.responseText);
        userProfile = gameStatus.user_data.metadata;
        if (userProfile['error']) {
          Notification.alert("Something went wrong, message : " + userProfile['error']);
          done = false;
        }
        if(callback) callback({'done' : done, 'gameStatus' : gameStatus});
      }
    });
  },
  
  genericPostRequest : function(request, params, callback){
    var done = true;
    var gameStatus = null;
    new Ajax.Request(request, {
      method : 'post',
      //asynchronous : true,
      parameters: { 'data' : Object.toJSON(params)},
      onSuccess: function(response) {},
      onComplete: function(response) {
        if(callback) callback(response);
      }
    });
    return {'done' : done, 'gameStatus' : gameStatus};
  },
  
  genericGetRequest : function(request, params, callback){
    var done = true;
    var gameStatus = null;
    new Ajax.Request(request, {
      method : 'get',
      //asynchronous : true,
      parameters: { 'data' : Object.toJSON(params)},
      onSuccess: function(response) {},
      onComplete: function(response) {
        if(callback) callback(response);
      }
    });
    return {'done' : done, 'gameStatus' : gameStatus};
  },
  
  friends : function(ids, callback){
      this.genericGetRequest( 'friends', {'friends_ids' : ids},
                            function(response) {
                              IDs = JSON.parse(response.responseText);
                              if(callback) callback(IDs);
                            });
  },
  
  globalScores : function(gameMode, callback){
      this.genericGetRequest( 'global_scores', {'game_mode' : gameMode},
                            function(response) {
                              scores = JSON.parse(response.responseText);
                              if(callback) callback(scores);
                            });
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

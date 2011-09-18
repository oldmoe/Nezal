var TSquareNetwork = Class.create(Network, {

  gameData : function(callback){
    this.genericGetRequest( 'data', {},
                          function(response) { 
                            var data = JSON.parse(response.responseText);
                            if(callback) callback(data);
                          });
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

  missionData : function(id, callback){
    this.genericGetRequest( 'mission', {'id' : id},
                    function(response) {
                      data = JSON.parse(response.responseText);
                      if(callback) callback(data);
                    });
  }

});

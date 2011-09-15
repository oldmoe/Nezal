var TSquareNetwork = Class.create(Network, {

  initializeGame : function(callback){
    this.genericGetRequest( 'data', {}, callback );
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
  }

});

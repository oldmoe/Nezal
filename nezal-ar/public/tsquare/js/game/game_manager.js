var game = null;
var GameManager = Class.create({
  
  initialize : function(urlParams){
    this.urlParams = urlParams;
    this.network = new TSquareNetwork();
    this.templateManager = new TemplatesManager(this.network);
    this.loader = new Loader();
    this.start();
  },

  start : function(){
    var self = this;
    var callback = function(data) {
      self.userData = data.user_data.data;
      self.userData.coins = data.user_data.coins;
      self.gameData = data.game_data.data;
      console.log(self.gameData);
      self.missions = data.missions_data.data;
      self.currentMission = missionData;//data.current_mission.data;
      self.meterBar = new MeterBar(self);
      self.scoreManager = new ScoreManager(self);
      self.inbox = new Inbox(self);
      self.marketplace = new Marketplace(self);
      game = new Game(self);
      self.game = game;
    }
    this.network.gameData(callback);
  },

  /* If there is a request object acceptance has lead to opening the game, 
    This function should handle it, and respond properly 
    example : request['date']['type'] = 'challenge'
    then open in the game on the mission page */
  processRequest : function(request) {

  },

  /* This function is to process url params ... if a request:
        Retrieve request object
        Send accept request to the server
        Delete request from user requests on social network
  */
  processParams : function(params, callback){
    var callback = function(requests_data){      
      var request = requests_data[params['request_ids']];
      if(params['request_ids'])
      {
        game.network.genericPostRequest('requests/accept', {request_id : params['request_ids'], from : request['from']['id']});
        socialEngine.deleteObject(params['request_ids']);
        callback(request);          
      }
    }
    socialEngine.getObject(params['request_ids'], callback);
  },

  sendRequest : function(request){
    var fbCallback = function(requests_data){
      var requests = {};
      for(var i in requests_data)
      {
        time = new Date(requests_data[i]['created_time'].gsub('-','/').gsub('T', ' ').split('+')[0]);
        requests[i] = { 'to' : requests_data[i]['to']['id'],
                        'timestamp' : time.getTime()/1000, 
                        'data' : requests_data[i]['data'] };
      }
      game.network.genericPostRequest('requests', {requests : requests})
    };
    game.network.fetchTemplate('requests/exclude', function(response){
      request['exclude_ids'] = JSON.parse(response).join(",")
      FBConnect.sendRequest(request, fbCallback)
    });
  }
 

});

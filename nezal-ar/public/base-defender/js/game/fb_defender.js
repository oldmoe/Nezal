FBDefender = {

    init : function(){
      FBConnect.init(function(){
                      Intro.initialize();
//        							$('scores').src = 'scores/friends.html?t=l9z73c'
                      });
    },
    
    processParams : function(params){
      var callback = function(requests_data){      
        var request = requests_data[params['request_ids']];
        if(params['request_ids'])
        {
          game.network.genericPostRequest('requests/accept', {request_id : params['request_ids'], from : request['from']['id']});
          FBConnect.deleteObject(params['request_ids']);          
        }
      }
      FBConnect.getObject(params['request_ids'], callback);
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
  
}

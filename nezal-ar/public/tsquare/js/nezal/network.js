var Network = Class.create({
  initialize : function(){
    
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

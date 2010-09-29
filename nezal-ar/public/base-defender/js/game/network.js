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
  }
});
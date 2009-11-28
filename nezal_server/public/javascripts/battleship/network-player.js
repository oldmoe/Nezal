var NetworkPlayer = Player.cloneProto();

NetworkPlayer.hitAt = function(x, y){
  //This should send a request of an event to the server 
  Event.send("game", Object.toJSON({"event": "fire", "x":x, "y":y}) );
}

NetworkPlayer.temp = function(x, y, result, hitPoints){
  Event.send("game", Object.toJSON({"event": "result", "x" : x, "y" : y, "hitPoints": hitPoints, "result" : result}) );
}

NetworkPlayer.play = function( ){
  Event.send("game", Object.toJSON({"event": "turn"}) );
}

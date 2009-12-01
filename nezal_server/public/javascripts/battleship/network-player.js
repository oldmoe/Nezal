var NetworkPlayer = Player.cloneProto();

NetworkPlayer.hitAt = function(x, y){
  //This should send a request of an event to the server 
  Event.send("game", Object.toJSON({"event": "fire", "x":x, "y":y}) );
}

NetworkPlayer.temp = function(player, x, y, result, hitPoints){
  Event.send("game", Object.toJSON({"event": "result", "player" : player,  "x" : x, "y" : y, "hitPoints": hitPoints, "result" : result}) );
}

NetworkPlayer.play = function( ){
  Event.send("game", Object.toJSON({"event": "turn"}) );
}

NetworkPlayer.finishedPlaying = function( ){
//   Event.send("game", Object.toJSON({"event": "turn"}) );
}

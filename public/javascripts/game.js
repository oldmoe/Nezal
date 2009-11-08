var Game = {

  init : function(players){
    console.log("game initialized")
    this.players = players;
    var me = this;
    this.players.each(function(player){ player.game = me })
    this.currentPlayer = 0
    this.finished = false;
    console.log("players are : "+ this.players.toString())  
  },
  
  start : function(){
    console.log("game started")
  },

  turn : function(){
    console.log("starting turn")
    this.players[this.currentPlayer].play();
    this.currentPlayer = ++(this.currentPlayer) % this.players.length; 
  },

  _turn : function(x, y){
    console.log("starting turn")
    this.players[this.currentPlayer]._play(x, y);
    this.currentPlayer = ++(this.currentPlayer) % this.players.length; 
  },

  finish : function(){
    console.log("game ended")
    this.finished = true;
  }
    
  
}

var Battleship = Game.clone();

Battleship.fireAt = function(x, y){
  var targetPlayer = this.players[(this.currentPlayer + 1) % this.players.length]
  var result = targetPlayer.hitAt(x, y);
  if(targetPlayer.hitPoints == 0){
    console.log("Player "+ this.currentPlayer + " won")
    this.finish();
  }
  return result;
}

var player1 = ComputerPlayer.clone(8, 8)
var player2 = ComputerPlayer.clone(8, 8)
var game = Battleship.clone([player1, player2]);
game.start();
//while(!game.finished){
//  game.turn();
//}
//game.finish();

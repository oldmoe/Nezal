var Game = Object.protoClone({

  init : function(players){
    this.players = players;
    var me = this;
    this.players.each(function(player){ player.game = me })
    this.currentPlayer = -1
    this.finished = false;
    return this
  },
  
  start : function(){
    console.log("game started")
  },

  turn : function(){
    if(this.finished) return;
    console.log("new turn")
    try{
      this.currentPlayer = ++(this.currentPlayer) % this.players.length; 
      this.players[this.currentPlayer].play();
    }catch(e){
      console.log(e)
    }
  },

  _turn : function(x, y){
    this.players[this.currentPlayer]._play(x, y);
    this.currentPlayer = ++(this.currentPlayer) % this.players.length; 
  },

  finish : function(){
    console.log("game finished")
    this.finished = true;
  }   
  
})

var Battleship = Game.cloneProto();

Battleship.fireAt = function(x, y){
  var targetPlayer = this.players[(this.currentPlayer + 1) % this.players.length]
  var result = targetPlayer.hitAt(x, y);
  if(targetPlayer.hitPoints == 0){
    this.finish();
  }
  return result;
}

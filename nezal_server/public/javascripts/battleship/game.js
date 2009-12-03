var Game = Object.cloneProto({

  init : function(players){
    this.players = players;
    var me = this;
    this.players.each(function(player){ player.game = me })
    this.currentPlayer = 0;
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

  finish : function(){
    console.log("game finished")
    this.finished = true;
  }   
  
})

var Battleship = Game.cloneProto();

Battleship.fireAt = function(x, y){
  var targetPlayer = this.players[(this.currentPlayer + 1) % this.players.length]
  targetPlayer.hitAt(x, y);
}

Battleship.fireCallback = function(result, x, y, hitPoints){
  var targetPlayer = this.players[(this.currentPlayer+1) % this.players.length];
  targetPlayer.hitPoints = hitPoints;
  this.players[this.currentPlayer].enemyMap[x][y] = result;
  this.players[this.currentPlayer].temp(this.currentPlayer, x, y, result, hitPoints)
  if(targetPlayer.hitPoints == 0){
    this.finish();
    return;
  }
//  this.players[this.currentPlayer].finishedPlaying();
  this.turn();
  return result;
}


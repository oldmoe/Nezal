var ComputerPlayer = Player.cloneProto();

ComputerPlayer.play = function( ){
  this.super().play();
  var done = false
  var x = null
  var y = null
  while(!done){
    x = Math.rand(this.enemyMap.length - 1)
    y = Math.rand(this.enemyMap[0].length - 1)
    if(this.enemyMap[x][y] == null){        
      this.game.fireAt(x, y);
      done = true
    }
  } 
  var me = this
  return this;
}

ComputerPlayer.init = function(){
  console.log("Initialize ComputerPlayer")
  this.super().init.apply(this, arguments)
  console.log("ComputerPlayer initialized")
  return this;
}

var ConsoleBattleship = {

  init : function(players){

    var game = Battleship.clone(players);   
    
    Aspect.before(game, "start", function(){
      console.log("game started");
    });
    
    Aspect.after(game, "fireAt", function(x, y, result){
      if(result == 1) console.log("Player "+ this.currentPlayer + " won");
    });
        
    Aspect.after(game, "finish", function(){
      console.log("game ended");
    });
            
    return game;   

  }

}

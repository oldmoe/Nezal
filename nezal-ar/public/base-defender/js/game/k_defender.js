KDefender = {

    init : function(){
      KConnect.init(function(){
        game = new Game();
        game.start();
      });
    }	
  
}

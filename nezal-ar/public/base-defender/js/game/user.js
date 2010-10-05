var User = Class.create({
  data : null,
  newbie : null,
  
  initialize : function(game){
    this.data = JSON.parse(game.gameStatus.user_data.metadata);
    this.newbie = game.gameStatus.user_data.newbie;
  }
   
});
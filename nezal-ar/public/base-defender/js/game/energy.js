var Energy = Class.create({
  energy : null,
  bonusSeconds : null,
  xpLevel : null,
  
  initialize : function(game){
    this.game = game;
    this.xpLevel = game.user.data.xp_info.xp_level;
  },
  
  currentXPLevelData : function(){
    this.game.data
  }
});
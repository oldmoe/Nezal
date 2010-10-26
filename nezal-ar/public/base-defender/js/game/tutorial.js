var Tutorial = Class.create({
  game : null,
  
  initialize : function(game){
    this.game = game;
    var self = this;
    
    if (game.user.newbie) {
      if(game.townhall.level == 0 && !game.townhall.inProgress){
        this.buildTownhall();
      }
    }
  },
  buildTownhall : function(){
    $('establish-town-hall').show();
    $('establish-town-hall').observe('click', function(){
      $('establish-town-hall').innerHTML = "Place your base on the map!";
      game.buildingMode.on(self.game.townhall, function(){
        $('establish-town-hall').hide();
      });
    });
  }
});
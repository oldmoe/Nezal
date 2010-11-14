var Tutorial = Class.create({
  game : null,
  
  initialize : function(game){
    this.game = game;
    var self = this;
    
    if (game.user.newbie) {
      if(!game.townhallFactory.townhall){
        this.buildTownhall();
      }
    }
  },
  buildTownhall : function(){
    $('establish-townhall-container').show();
    $('establish-townhall').observe('click', function(){
      $('establish-townhall-container').hide();
      game.buildingMode.on(self.game.townhallFactory.newTownhall(), function(){
        //$('establish-townhall').hide();
      });
    });
  }
});
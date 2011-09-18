var MeterBar = Class.create({

  initialize : function(game){
    /* This should be MOVED to initialize game part */
    this.network = game.network;    
    this.templateManager = game.templateManager;
    var self = this;
//    new Loader().load([ {images : [], path: 'images/game_elements/', store: 'game_elements'}],
//                      {
//                        onFinish: function(){
                          self.display();
//                        }
//                      });
  },

  display : function(){
    $('meterBar').innerHTML = this.templateManager.load('meterBar', {});
  }

});

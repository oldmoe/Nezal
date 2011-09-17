var Marketplace = Class.create({
  moves : {},
  members : {},
  items : {},
  powerups : {},
  special : {},
  crowd_items :{},
  initialize : function(){
    var self = this;
    var loaderFinishCallback = function(){
      self.network = new TSquareNetwork();
      self.templateManager = new TemplatesManager(self.network);
      self.network.initializeGame(function(gameData){
        var itemsData = JSON.parse(gameData.responseText).game_data.data;
        
        var moves = itemsData.commands;
        var members = itemsData.crowd_members;
        var items = itemsData.holder_items;
        var powerups = itemsData.power_ups;
        var special = itemsData.special_items;
        var crowd_items = itemsData.crowd_items;
      });
      $('marketplace').innerHTML = self.templateManager.load('marketplace', { marketplace: self });
    }
    
    new Loader().load([ {images : ["buy_window_title.png", "close_button.png"], path: 'images/marketplace/', store: 'marketplace'}],
                      {
                        onFinish: function(){
                          loaderFinishCallback();
                          Game.addLoadedImagesToDiv('marketplace');
                        }
                      });
  },
});
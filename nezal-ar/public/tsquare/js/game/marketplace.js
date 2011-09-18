var Marketplace = Class.create({
  moves : {},
  members : {},
  items : {},
  powerups : {},
  special : {},
  crowd_items :{},
  
  columns : 5,
  itemWidth : 137,
  rows : 2,
  
  initialize : function(gameManager){
    this.gameManager = gameManager;
    this.network = this.gameManager.network;
    this.templateManager = this.gameManager.templateManager;
    var itemsData = gameData;
    
    this.moves = itemsData.commands;
    this.members = itemsData.crowd_members;
    this.items = itemsData.holder_items;
    this.powerups = itemsData.power_ups;
    this.special = itemsData.special_items;
    this.crowd_items = itemsData.crowd_items;    
  },
  
  openMarketplace : function(){
    var self = this;
    self.adjustedMoves = [];
    var loaderFinishCallback = function(){
      for(var mainItem in self.moves){
        for(var subItem in self.moves[mainItem]){
          var ItemName = mainItem + ' ' + subItem;
          self.adjustedMoves.push({name : ItemName + ' 1'});
          self.adjustedMoves.push({name : ItemName + ' 2'});
          self.adjustedMoves.push({name : ItemName + ' 3'});
          self.adjustedMoves.push({name : ItemName + ' 4'});
          self.adjustedMoves.push({name : ItemName + ' 5'});
          self.adjustedMoves.push({name : ItemName + ' 6'});
        }
      }
      
      $('marketplace').innerHTML = self.templateManager.load('marketplace', { marketplace: self });
      
      self.containerWidth = Math.ceil( self.adjustedMoves.size() / self.rows) * self.itemWidth;
      self.containerWidth = Math.max( self.containerWidth, this.columns * this.itemWidth );
      $$('#moves ul')[0].setStyle( { width: self.containerWidth + 'px' } );
      
      self.navigatorsAlive();
    }
    
    new Loader().load([ {images : ["buy_window_title.png", "close_button.png", "tab_background.png"], path: 'images/marketplace/', store: 'marketplace'}],
                      {
                        onFinish: function(){
                          loaderFinishCallback();
                          Game.addLoadedImagesToDiv('marketplace');
                        }
                      });
  },
  
  navigatorsAlive : function(marketTab){
    var getIntegerStyle = function(stringStyle){
      var length = stringStyle.length;
      return Number(stringStyle.substr(0, length-1));
    }
    var left = getIntegerStyle( $$('#' + marketTab + ' ul')[0].getStyle('marginLeft') );
    if( left == 0 ){
      $$('.leftControls a')[0].removeClassName('selected');
      $$('.leftControls a')[1].removeClassName('selected');
    } else {
      $$('.leftControls a')[0].addClassName('selected');
      $$('.leftControls a')[1].addClassName('selected');
    }
    
    var right = this.columns * this.itemWidth + left;
    if( right == self.containerWidth ){
      $$('.leftControls a')[0].removeClassName('selected');
      $$('.leftControls a')[1].removeClassName('selected');
    } else {
      $$('.leftControls a')[0].addClassName('selected');
      $$('.leftControls a')[1].addClassName('selected');
    }
  }
});

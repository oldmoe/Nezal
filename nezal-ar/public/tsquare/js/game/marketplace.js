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
    
    this.openMarketplace();
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
          self.adjustedMoves.push({name : ItemName + ' 7'});
        }
      }
      
      $('marketplace').innerHTML = self.templateManager.load('marketplace', { marketplace: self });
      
      self.containerWidth = Math.ceil( self.adjustedMoves.size() / self.rows) * self.itemWidth;
      self.containerWidth = Math.max( self.containerWidth, self.columns * self.itemWidth );
      $$('#moves ul')[0].setStyle( { width: self.containerWidth + 'px' } );
      
      self.adjustNavigators('moves');
      $$('#marketplace .close')[0].stopObserving('click');
      $$('#marketplace .close')[0].observe('click', function(event){
        $('marketplace').innerHTML = "";
      })
    }
    
    new Loader().load([ {images : ["buy_window_title.png", "close_button.png", "tab_background.png"], path: 'images/marketplace/', store: 'marketplace'}],
                      {
                        onFinish: function(){
                          loaderFinishCallback();
                          Game.addLoadedImagesToDiv('marketplace');
                        }
                      });
  },
  
  adjustNavigators : function(marketTab){
    var self = this;
    var getIntegerStyle = function(stringStyle){
      var length = stringStyle.length;
      return Number(stringStyle.substr(0, length-2));
    }
    var left = getIntegerStyle( $$('#' + marketTab + ' ul')[0].getStyle('marginLeft') );
    console.log( "left : " + left );
    //Adjusting left controls states
    if( left == 0 ){
      $$('.leftControls a')[0].removeClassName('selected');
      $$('.leftControls a')[1].removeClassName('selected');
    } else {
      $$('.leftControls a')[0].addClassName('selected');
      $$('.leftControls a')[1].addClassName('selected');
    }
    
    //Adjusting right controls states
    var right = self.containerWidth + left - ( self.columns * self.itemWidth );
    console.log( "right : " + right );
    if( right == 0 ){
      $$('.rightControls a')[0].removeClassName('selected');
      $$('.rightControls a')[1].removeClassName('selected');
    } else {
      $$('.rightControls a')[0].addClassName('selected');
      $$('.rightControls a')[1].addClassName('selected');
    }
    
    
    $$('.leftControls a')[0].stopObserving('click');
    $$('.leftControls a')[1].stopObserving('click');
    $$('.rightControls a')[0].stopObserving('click');
    $$('.rightControls a')[1].stopObserving('click');
    
    
    $$('.leftControls a')[0].observe('click', function(event){
      if( left != 0 ){
        $$('#' + marketTab + ' ul')[0].setStyle( { marginLeft:  (left + self.itemWidth)+'px' } );
        self.adjustNavigators(marketTab);
      }
    });
    $$('.leftControls a')[1].observe('click', function(event){
      if( left != 0 ){
        var maxShift = Math.min( self.columns*self.itemWidth, -left );
        $$('#' + marketTab + ' ul')[0].setStyle( { marginLeft:  (left + maxShift)+'px' } );
        self.adjustNavigators(marketTab);
      }
    });
    $$('.rightControls a')[0].observe('click', function(event){
      if (right != 0) {
        $$('#' + marketTab + ' ul')[0].setStyle({marginLeft: (left - self.itemWidth) + 'px'});
        self.adjustNavigators(marketTab);
      }
    });
    $$('.rightControls a')[1].observe('click', function(event){
      if( right != 0 ){
        var maxShift = Math.min( self.columns*self.itemWidth, right );
        $$('#' + marketTab + ' ul')[0].setStyle( { marginLeft:  (left - maxShift)+'px' } );
        self.adjustNavigators(marketTab);
      }
    });
  }
});

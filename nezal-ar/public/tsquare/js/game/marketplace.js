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
    
    new Loader().load([ {images : ["buy_window_title.png", "close_button.png", "tab_background.png"], path: 'images/marketplace/', store: 'marketplace'}], {
      onFinish : function(){}
    });
    
    
    var self = this;
    this.adjustedMoves = [];
    for(var mainItem in this.moves){
      for(var subItem in this.moves[mainItem]){
        var ItemName = mainItem + ' ' + subItem;
        this.adjustedMoves.push({name : ItemName});
      }
    }
    
    this.adjustedMembers = [];
    var membersImages = []
    for(var item in this.members['specs']){
      this.adjustedMembers.push({name : item});
      membersImages.push(item + ".png");
    }
    console.log(membersImages);
    new Loader().load([ {images : membersImages, path: 'images/marketplace/members/', store: 'marketplace'}], {
      onFinish : function(){}
    });
  },
  
  openMarketplace : function(){
    var self = this;
    $('marketplace').innerHTML = this.templateManager.load('marketplace');
    
    //Attaching triggers to the market placetabs
    $('marketMembers').stopObserving('click');
    $('marketMembers').observe('click', function(event){
      $$('#marketplace #floatingItems')[0].innerHTML = self.templateManager.load('floatingItems', { categoryItems: self.adjustedMembers });
      Game.addLoadedImagesToDiv('marketplace');
      $('marketMembers').parentNode.addClassName("selected");
      $('marketMoves').parentNode.removeClassName("selected");
    });
    
    $('marketMoves').stopObserving('click');
    $('marketMoves').observe('click', function(event){
      $$('#marketplace #floatingItems')[0].innerHTML = self.templateManager.load('floatingItems', { categoryItems: self.adjustedMoves });
      Game.addLoadedImagesToDiv('marketplace');
      $('marketMoves').parentNode.addClassName("selected");
      $('marketMembers').parentNode.removeClassName("selected");
    });
    
    //Loading the template of the auto selected tab
    $$('#marketplace #floatingItems')[0].innerHTML = this.templateManager.load('floatingItems', { categoryItems: this.adjustedMoves });
    Game.addLoadedImagesToDiv('marketplace');
      
    this.containerWidth = Math.ceil( this.adjustedMoves.size() / this.rows) * this.itemWidth;
    this.containerWidth = Math.max( this.containerWidth, this.columns * this.itemWidth );
    $$('#floatingItems ul')[0].setStyle( { width: this.containerWidth + 'px' } );
    
    this.adjustNavigators('floatingItems');
    $$('#marketplace .close')[0].stopObserving('click');
    $$('#marketplace .close')[0].observe('click', function(event){
      $('marketplace').innerHTML = "";
    })
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

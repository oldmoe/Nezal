var Payment = Class.create({
  positions : ['left', 'middle', 'right'],
  
  packages : {
    left : {
      priceCategory : '0.8',
      price : '0.80',
      coins : '2,500'
    }, 
    middle : {
      priceCategory : '1.6',
      price : '1.60',
      coins : '6,000'
    },
    right : {
      priceCategory : '2.4',
      price : '2.4',
      coins : '10,000'
    }
  },
  
  activatePackage : function(priceCategory, position){
    var self = this;
    
    this.stopObservingEvents();
    
    //reattaching navigation sounds
    $$('#payments-container .clickSound').each(function(element){
      element.observe('click', function(){Sounds.play(Sounds.gameSounds.click)})
    });
    
	[$('top-' + position + '-selection'), $('middle-selection')].invoke("observe", "click", function(){
      //document.location.href = "http://daopay.com/payment/?appcode=62070&price=" + priceCategory;
      //Intro.showDaopayBg("http://daopay.com/pay/?appcode=62070&price=" + priceCategory);
      window.open("http://daopay.com/pay/?appcode=62070&price=" + priceCategory, null, "width=400,height=550");
    });
    
    this.positions.without(position).each(function(element){
      $('top-' + element + '-selection').observe("click", function(){
        if( element == "left" )
          self.activateLeftPackage();
        else if ( element == "middle" )
          self.activateMiddlePackage();
        else if ( element == "right" )
          self.activateRightPackage();
      })
    });
    
    this.adjustPackagesZIndex(
      this.positions.map(function(e){
        if(e == position) 
          return 1001
        else 
          return 1000
      })
    );
    
    $('daopay-command').innerHTML = Text.payments['daopay']['packageCommand']
                                              .replace('*price*', this.packages[position]['price'])
                                              .replace('*reward*', this.packages[position]['coins']);
  },
  
  activateMiddlePackage : function(){
    this.activatePackage(this.packages['middle']['priceCategory'], "middle");
  },
  
  activateLeftPackage : function(){
    this.activatePackage(this.packages['left']['priceCategory'], "left");
  },
  
  activateRightPackage : function(){
    this.activatePackage(this.packages['right']['priceCategory'], "right");
  },
  
  stopObservingEvents : function(){
    [$('top-right-selection'), $('top-left-selection'), $('top-middle-selection'),$('middle-selection') ].invoke("stopObserving", "click")
  },
  
  adjustPackagesZIndex : function(indeces){
    $("pay-left-image").style.zIndex = indeces[0];
    $("pay-middle-image").style.zIndex = indeces[1];
    $("pay-right-image").style.zIndex = indeces[2];
  }
});

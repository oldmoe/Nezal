var ResearchBuildingDisplay = Class.create(BuildingDisplay, {

  numberOfBubbles : 4,
  bubbles : null,
  bubbleImgs : null,
  bubblesInAction : null,
  bubbleSmallSizeLimit : { width : 9, height : 9 },
  bubbleLargeSizeLimit : { width : 48, height : 48 },
  bubbleInitialXShift : [6, 18, 30],
  bubbleInitialYShift : -35,
  animated : false,

  initialize : function($super,owner,properties){
    var self = this;
    var colors = ['blue', 'red', 'green', 'white', 'yellow'];
    this.bubbleImgs = [];
    colors.each(function(color){
                      self.bubbleImgs.push(Loader.images.researches[color + "_bubble.png"]);
                });
    this.bubbles = [];
    for (var i = 0; i < this.bubbleImgs.length; i++) {
      var bubbleSprite = new DomImgSprite(new Bubble(owner.coords, this.bubbleLargeSizeLimit), {img : this.bubbleImgs[i]}, {
        shiftY: this.bubbleInitialYShift,
        shiftX: this.bubbleInitialXShift[Math.floor(Math.random()*100 % this.bubbleInitialXShift.length)]
      });
      bubbleSprite.setImgWidth(this.bubbleLargeSizeLimit.width/this.numberOfBubbles);
      this.bubbles.push(bubbleSprite);
    }
    this.bubblesInAction = [this.bubbles[0]];
    this.bubbles.splice(0, 1);
    [8, 15].each(function(time){ owner.game.reactor.push( time, function(){
                                        if( self.bubblesInAction.length < self.numberOfBubbles )
                                        {
                                          var bubble = Math.floor(Math.random()*100 % self.bubbles.length);
                                          self.bubblesInAction.push(self.bubbles[bubble]);
                                          self.bubbles.splice(bubble, 1);
                                        } 
                                      })
                  });
    this.defaultAction = this.finishResearch;
    $super(owner,properties);
  },

  createSprites : function($super){
    $super();
    this.sprites.productionAnimation = new DomImgSprite(this.owner, {img: this.animateImg});
    this.stopFinishAnimation();
  },

  render : function($super){
    if(this.owner.animated)
    {
      this.renderFinishAnimation();
    }
    else 
    {
      this.renderNormalAnimation();
    }
    $super();
  },  

  finishResearch : function(){
    this.owner.animated = true;
    this.sprites.productionAnimation.repeats = 0;
  	this.sprites.productionAnimation.currentAnimationFrame = 0;
    this.sprites.productionAnimation.show();
    this.sprites.outline.hide();
    this.bubblesInAction.each(function(bubble){
      bubble.hide();
    })
    this.owner.productionbubbles = [];
    for (var i = 0; i < this.bubbleImgs.length * 3; i++) {
      var self = this;  
      this.owner.game.reactor.push( i, function(){
                                      var color = Math.floor(Math.random()*100 % self.bubbleImgs.length);
                                      var rand = Math.random()*100 % self.bubbleInitialXShift.length;
                                      var rand2 = Math.floor(Math.random()*100 % self.bubbleInitialXShift.length);
                                      var rand3 = Math.floor(Math.random()*100 % 4);
                                      var sign = 1;
                                      if( rand < self.bubbleInitialXShift.length/2) 
                                      {
                                        sign = -1;
                                      }
                                      var bubbleSprite = new DomImgSprite(new Bubble(self.owner.coords, self.bubbleLargeSizeLimit),
                                                                         {img : self.bubbleImgs[color]}, {
                                        shiftY: self.bubbleInitialYShift,
                                        shiftX: sign * self.bubbleInitialXShift[Math.floor(rand)] * (rand3)
                                      });
                                      bubbleSprite.setImgWidth(self.bubbleSmallSizeLimit.width * rand2);
                                      self.owner.productionbubbles.push(bubbleSprite);
                                    })
    }
  },

  renderNormalAnimation : function(){
  	this.sprites.building.currentAnimationFrame = (this.sprites.building.currentAnimationFrame + 1) % this.sprites.building.noOfAnimationFrames;
    if (this.owner.state == this.owner.states.NORMAL) {
      var self = this;
      this.bubblesInAction.each(function(bubble){
        bubble.show();
        bubble.render();
      })
      for( var i = 0; i < this.bubblesInAction.length; i++ )
      {
        var bubble = this.bubblesInAction[i];
        bubble.setImgWidth(bubble.imgWidth + 2);
        bubble.shiftX = bubble.shiftX - 1;
        bubble.shiftY = bubble.shiftY - (3 + Math.round(bubble.imgWidth/9));
        if(bubble.imgWidth > self.bubbleLargeSizeLimit.width)
        {
          bubble.setImgWidth(this.bubbleSmallSizeLimit.width);
          bubble.shiftX = this.bubbleInitialXShift[Math.floor(Math.random()*100 % this.bubbleInitialXShift.length)];
          bubble.shiftY = this.bubbleInitialYShift;
          bubble.hide();
          this.bubblesInAction.splice(i, 1);  
          this.bubbles.push(bubble);
        }
      }
      var randomTime = Math.floor(Math.random()*100)
      this.owner.game.reactor.push( randomTime, function(){
                                      if( self.bubblesInAction.length < self.numberOfBubbles )
                                      {
                                        var bubble = Math.floor(Math.random()*100 % self.bubbles.length);
                                        self.bubblesInAction.push(self.bubbles[bubble]);
                                        self.bubbles.splice(bubble, 1);
                                      } 
                                    })
      /* Clean up for leftover finish animation bubbles*/
      if(this.owner.productionbubbles)
      {
        for( var i = 0; i < this.owner.productionbubbles.length; i++ )
        {
          var bubble = this.owner.productionbubbles[i];
          bubble.setImgWidth(bubble.imgWidth + 2);
          bubble.shiftX = bubble.shiftX - 1;
          bubble.shiftY = bubble.shiftY - (3 + Math.round(bubble.imgWidth/9));
          bubble.render();
          if(bubble.imgWidth > self.bubbleLargeSizeLimit.width)
          {
            this.owner.productionbubbles[i].hide();
          }
        }
      }
    }
  },

  renderFinishAnimation : function(){
    var currAnimaionFrame = this.sprites.productionAnimation.currentAnimationFrame;
    if(currAnimaionFrame == this.sprites.productionAnimation.noOfAnimationFrames - 1)
    {
      this.sprites.productionAnimation.repeats = this.sprites.productionAnimation.repeats + 1;
      if(this.sprites.productionAnimation.repeats == 5)
      {
        this.stopFinishAnimation();
        return;
      }
    }
    this.sprites.building.hide();
    this.sprites.outline.hide();
	  this.sprites.productionAnimation.currentAnimationFrame = (this.sprites.productionAnimation.currentAnimationFrame + 1) %  
                                                               this.sprites.productionAnimation.noOfAnimationFrames;
    var self = this;
    for( var i = 0; i < this.owner.productionbubbles.length; i++ )
    {
      var bubble = this.owner.productionbubbles[i];
      bubble.setImgWidth(bubble.imgWidth + 2);
      bubble.shiftX = bubble.shiftX - 1;
      bubble.shiftY = bubble.shiftY - (3 + Math.round(bubble.imgWidth/9));
      if(bubble.imgWidth > self.bubbleLargeSizeLimit.width && this.owner.animated)
      {
        var rand = Math.random()*100 % this.bubbleInitialXShift.length;
        var rand2 = Math.floor(Math.random()*100 % this.bubbleInitialXShift.length);
        var rand3 = Math.floor(Math.random()*100 % 4);
        var sign = 1;
        if( rand < this.bubbleInitialXShift.length/2) 
        {
          sign = -1;
        }
        bubble.setImgWidth(this.bubbleSmallSizeLimit.width * rand2);
        bubble.shiftX = sign * this.bubbleInitialXShift[Math.floor(rand)] * (rand3);
        bubble.shiftY = this.bubbleInitialYShift;
      }
      bubble.show();
      bubble.render();
    }
  },

  stopFinishAnimation : function(){
    this.owner.animated = false
    this.sprites.building.show();
    this.sprites.productionAnimation.hide();
  },

  renderPanel: function($super){
    $super();
    var self = this.owner;
    self.game.selectedBuildingPanel = new BuildingPanel(self, function(){return ""});
  }

});

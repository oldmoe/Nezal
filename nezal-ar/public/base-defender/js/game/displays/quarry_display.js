var QuarryDisplay = Class.create(ResourceBuildingDisplay, {
  numberOfBubbles : 3,
  bubbles : null,
  bubbleImg : null,
  bubbleElevation : null,
  bubbleXMovementLimit : 15,
  bubbleSmallSizeLimit : 5,
  bubbleLargeSizeLimit : 23,
  bubbleInitialXShift : 65,
  initialize : function($super,owner,properties){
    var self = this;
    this.bubbles = [];
    this.bubbleImg = Loader.images.smoke["smoke_big.png"];
    this.bubbleElevation = 60;
    
    for (var i = 0; i < this.numberOfBubbles; i++) {
      
      var bubbleSprite = new DomImgSprite(new Bubble(owner.coords, this.bubbleLargeSizeLimit), {img : this.bubbleImg}, {
        shiftY: 0,
        shiftX: this.bubbleInitialXShift
      });
      bubbleSprite.owner.yMovement = i*this.bubbleElevation /(this.numberOfBubbles);
      bubbleSprite.owner.xMovement = this.bubbleInitialXShift;
      bubbleSprite.setImgWidth(10);
      this.bubbles.push(bubbleSprite);
    }
        $super(owner,properties);
		
  },
  
  render : function($super){
    $super();
    
    if(!this.owner.producing || !this.owner.working || this.owner.hp <= 0 || this.owner.assignedWorkers==0){
      this.bubbles.each(function(bubble){
        bubble.hide()
      })
      return;
    }
    if (this.owner.state == this.owner.states.NORMAL) {
      var self = this;
      this.bubbles.each(function(bubble){
        bubble.owner.yMovement -= 0.5;
        bubble.shiftY = bubble.owner.yMovement - 25;
        if (bubble.owner.yMovement < -self.bubbleElevation) {
          bubble.owner.reset();
          bubble.owner.xMovement = self.bubbleInitialXShift;
          bubble.setImgWidth(10);
          return;
        }
        
        var sizeDirection = 1;
        for(var i=0;i<self.bubbleElevation/3;i++){
          if (-bubble.owner.yMovement == (i+1)*3) {
            bubble.shiftX = bubble.owner.xMovement-i*3/2;
            bubble.img.setOpacity(1 + bubble.owner.yMovement/self.bubbleElevation);
            bubble.setImgWidth((i+1)*3 + 10);
          }
        }
        bubble.show();
        bubble.render();
      })
    }
  }
});

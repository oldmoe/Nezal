var Navigation = Class.create({
  blockSize : 32,
  ownerScene : null,
  movementScale : 20,
  movementSpeed : 100,
  periodicalMovementEvent : null,
  
  blocks : {
    vertical : 0,
    horizontal : 0
  },
  
  triggers : {
    up : $('up-navigation-trigger'),
    down : $('down-navigation-trigger'),
    left : $('left-navigation-trigger'),
    right : $('right-navigation-trigger')
  },
  
  initialize : function(scene){
    var self = this;
    this.ownerScene = scene;
    
    //Registering unobtrusive events
    $('left-navigation-trigger').observe('mouseover', function(){self.repeatMovement(-1, 0);});
    $('right-navigation-trigger').observe('mouseover', function(){self.repeatMovement(1, 0);});
    $('up-navigation-trigger').observe('mouseover', function(){self.repeatMovement(0, -1);});
    $('down-navigation-trigger').observe('mouseover', function(){self.repeatMovement(0, 1);});
    
    $('left-navigation-trigger').observe('mouseout', function(){self.stopMovement();});
    $('right-navigation-trigger').observe('mouseout', function(){self.stopMovement();});
    $('up-navigation-trigger').observe('mouseout', function(){self.stopMovement();});
    $('down-navigation-trigger').observe('mouseout', function(){self.stopMovement();});
  },
  
  repeatMovement : function(dX, dY){
    var self = this;
    
    this.periodicalMovementEvent = setInterval(function(){self.move(dX, dY)}, this.movementSpeed);
  },
  
  stopMovement : function(){
    clearInterval(this.periodicalMovementEvent);
  },
  
  move : function(dX, dY){
    var scene = this.ownerScene;
    
    //Change base coords
    scene.x += dX * this.movementScale;
    scene.y += dY * this.movementScale;
    
    //Enabling all triggers
    [this.triggers.up, this.triggers.down, this.triggers.left, this.triggers.right].each(function(nav_trigger){
      nav_trigger.removeClassName("limit-reached");
    });
    
    //Validate extents to disable corresponding triggers
    if(scene.x <= 0){
      scene.x = 0
      this.triggers.left.addClassName("limit-reached")
    } else if(scene.x >= this.blocks.horizontal * this.blockSize - scene.width){
      scene.x = this.blocks.horizontal * this.blockSize - scene.width
      this.triggers.right.addClassName("limit-reached")
    }
    
    if(scene.y <= 0){
      scene.y = 0
      this.triggers.up.addClassName("limit-reached")
    } else if(scene.y >= this.blocks.vertical * this.blockSize - scene.height){
      scene.y = this.blocks.vertical * this.blockSize - scene.height
      this.triggers.down.addClassName("limit-reached")
    }
    
    scene.render()  
  }
});
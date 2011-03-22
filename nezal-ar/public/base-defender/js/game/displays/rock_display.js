var Rock = Class.create( {

  name : "rock",

  imgHeight : 20,
  imgWidth : 20,

  position : {
    0 : {x : 17, y : 44, zIndex : 5 }, 
    1 : {x : 18, y : 36, zIndex : 2 },
    2 : {x : 10, y : 37, zIndex : 2 },
    3 : {x : 26, y : 36, zIndex : 2 }, 
    4 : {x : 27, y : 44, zIndex : 5 }, 
    5 : {x : 15, y : 34, zIndex : 2 }, 
    6 : {x : 17, y : 40, zIndex : 5 }, 
    7 : {x : 30, y : 32, zIndex : 2 }
  },

  position2 : {
    0 : {x : 57, y : 44, zIndex : 5 }, 
    1 : {x : 42, y : 10, zIndex : 2 },
    2 : {x : 10, y : 17, zIndex : 2 },
    3 : {x : 0, y : 10, zIndex : 2 }, 
    4 : {x : -12, y : 44, zIndex : 5 }, 
    5 : {x : -3, y : 38, zIndex : 2 }, 
    6 : {x : 17, y : 54, zIndex : 5 }, 
    7 : {x : 48, y : 36, zIndex : 2 }
  },

  initialize : function(owner){
    this.owner = owner;
    this.angle = 0;
    this.name = "rock";
    this.game = owner.game;
    this.coords = { x : 0, y : 0};
    this.coords.x = this.owner.coords.x;
    this.coords.y = this.owner.coords.y;
  }
  
});

var MovingRock = Class.create({
    
  currentStep : 0,
  moveRatio : 10,
  attacker : null,
  imgHeight : 93,
  imgWidth : 64,
  zdim : 31,

  initialize : function(owner) {
    this.owner = owner;
    this.extraXStep = 0;
    this.extraYStep = 0;
    this.coords = { x : 0, y : 0}
    this.coords.x = this.owner.coords.x + this.owner.position2[this.owner.owner.angle].x + this.extraXStep;
    this.coords.y = this.owner.coords.y + this.owner.position2[this.owner.owner.angle].y + this.extraYStep;
    this.rockImg = Loader.images.weapons["rock.png"];
    this.display =  new DomImgSprite(this, {img: this.rockImg});
    this.attacker = null;
    var self = this;
    this.owner.game.scene.push(this);
  },

  tick : function() {
    if(!this.attacker){
      this.attacker = this.owner.owner.attacker;
      this.extraXStep = 0;
      this.extraYStep = 0;
    }
    if( this.attacker ) {
      var targetX = this.attacker.coords.x + this.attacker.imgWidth/3 - 10;
      var targetY = this.attacker.coords.y + 2*this.attacker.imgHeight/3;
      if(this.coords.x == targetX && this.coords.y == targetY )
      {
        this.currentStep = 0;
        this.attacker = null;
        this.display.destroy();
        return;
      }else {
        var move = Util.getNextMove(this.coords.x, this.coords.y, targetX, targetY, 20)
        this.extraXStep = move[0];
        this.extraYStep = move[1];
        if( Math.abs(this.extraXStep) > Math.abs(targetX - this.coords.x))
          this.extraXStep = targetX - this.coords.x
        if( Math.abs(this.extraYStep) > Math.abs(targetY - this.coords.y))
          this.extraYStep = targetY - this.coords.y
        this.coords.x = this.coords.x + this.extraXStep;
        this.coords.y = this.coords.y + this.extraYStep;
        if(this.coords.x == targetX && this.coords.y == targetY )
        {
          this.currentStep = 0;
          this.attacker = null;
          this.display.destroy();
          this.owner.game.scene.remove(this);
        }
        return;
      }
    }else {
      this.display.destroy();
      this.owner.game.scene.remove(this);
    }
  }
    
});

var RockDisplay = Class.create( Display, {

  moveSteps : 2,

  initialize : function($super,owner,properties, container){
	  $super(owner,properties)
		Object.extend(this.owner,properties);
    this.container = container;
    this.createSprites();
    this.currentMove = 0;
  },

  createSprites : function() {
    this.rockImg = Loader.images.weapons["rock.png"];
    this.sprites.rock = this.container.newDomImgSprite(this.owner, {img: this.rockImg});
    this.movingRocks = [];
  },

  render : function() {
    if(this.currentMove == 8 ) this.currentMove = 0;
    var moveX = (this.owner.position2[this.owner.owner.angle].x - this.owner.position[this.owner.owner.angle].x)/this.moveSteps*this.currentMove;
    var moveY = (this.owner.position2[this.owner.owner.angle].y - this.owner.position[this.owner.owner.angle].y)/this.moveSteps*this.currentMove;
    this.sprites.rock.setShiftX(this.owner.position[this.owner.owner.angle].x + moveX);
    this.sprites.rock.setShiftY(this.owner.position[this.owner.owner.angle].y + moveY);  
    this.sprites.rock.setZIndex(this.owner.position[this.owner.owner.angle].zIndex);
    for(var sprite in this.sprites){
			this.sprites[sprite].render();
		}
    for(var i = 0; i< this.movingRocks.length; i++)
    {
      this.movingRocks[i].display.render();
    }
  },

  animate : function() {
    this.currentMove += 1;
    if(this.currentMove == this.moveSteps)
    {
      this.sprites.rock.hide();
      var rock = new MovingRock(this.owner);
      this.movingRocks.push(rock);
      rock.display.show();
    }
    if(this.currentMove == 8)
    {
      this.currentMove = 0;
      this.sprites.rock.show();
    }
  },

  stopAnimation : function(){
    this.currentMove = 0;
    this.sprites.rock.show();
  }, 

  hide : function() {
    for(var sprite in this.sprites){
			this.sprites[sprite].hide();
		}
    for(var i = 0; i< this.movingRocks.length; i++)
    {
      this.movingRocks[i].display.hide();
    }
  }

});

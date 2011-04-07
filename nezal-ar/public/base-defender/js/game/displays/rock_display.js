var Rock = Class.create( {

  name : "rock",

  imgHeight : 15,
  imgWidth : 15,
  width : 15,
  height : 15,

  position : {
    0 : {x : 22, y : 48, zIndex : 5 }, 
    1 : {x : 24, y : 36, zIndex : 2 },
    2 : {x : 12, y : 40, zIndex : 2 },
    3 : {x : 26, y : 36, zIndex : 2 }, 
    4 : {x : 29, y : 48, zIndex : 5 }, 
    5 : {x : 19, y : 35, zIndex : 2 }, 
    6 : {x : 19, y : 44, zIndex : 5 }, 
    7 : {x : 30, y : 36, zIndex : 2 }
  },

  position2 : {
    0 : {x : 46, y : 44, zIndex : 5 }, 
    1 : {x : 41, y : 20, zIndex : 2 },
    2 : {x : 12, y : 25, zIndex : 2 },
    3 : {x : 6, y : 18, zIndex : 2 }, 
    4 : {x : 0, y : 44, zIndex : 5 }, 
    5 : {x : 3, y : 42, zIndex : 2 }, 
    6 : {x : 19, y : 50, zIndex : 5 }, 
    7 : {x : 44, y : 42, zIndex : 2 }
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

var RockDisplay = Class.create( Display, {

  moveSteps : 4,

  initialize : function($super,owner,properties, container){
	  $super(owner,properties)
    this.container = container;
    this.currentMove = 0;
    this.createSprites();
  },

  createSprites : function() {
    this.movingRocks = [];
    this.rockImg = Loader.images.weapons["rock.png"];
    this.sprites.rock = this.container.newDomImgSprite(this.owner, {img: this.rockImg});
    this.render();
  },

  render : function() {
    if(this.currentMove == 9 ) this.currentMove = 0;
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
      this.movingRocks[i].tick();
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
    if(this.currentMove == 9)
      this.currentMove = 0;
  },

  stopAnimation : function(){
    this.currentMove = 0;
    this.sprites.rock.show();
  }, 

  hide : function() {
    for(var sprite in this.sprites){
      console.log('hidden')
			this.sprites[sprite].hide();
      console.log('hidden', this.sprites[sprite].div)
		}
    for(var i = 0; i< this.movingRocks.length; i++)
    {
      this.movingRocks[i].display.hide();
    }
  }

});

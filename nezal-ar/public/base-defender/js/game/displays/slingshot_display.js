SlingshotDisplay = Class.create( Display, {

  animated : false,

  displayPriority : {
    0 : 4, 
    1 : 2,
    2 : 2,
    3 : 2,
    4 : 4,
    5 : 2,
    6 : 4,
    7 : 2
  },

  initialize : function($super,owner,properties){
    $super(owner,properties)
    this.container = owner.container;
    this.createSprites();
    Object.extend(this.owner,properties)
    this.sprites.face.render();
    this.sprites.weapon.render();
    this.manageStateChange();
    this.owner.game.scene.pushAnimation(this);
    this.owner.rock.display = new RockDisplay(this.owner.rock, properties, this.container);
    this.id = parseInt(Math.random() * 10000);
  },

  createSprites : function(){
    this.faceImg = Loader.images.buildings[this.owner.owner.name + '_face.png'];
    this.weaponImg = Loader.images.weapons[this.owner.name + ".png"];
    this.sprites.face = this.container.newDomImgSprite(this.owner, {img: this.faceImg});
    this.sprites.weapon = this.container.newDomImgSprite(this.owner, {img: this.weaponImg});
  },

  manageStateChange : function(){
    var self = this;
    this.owner.owner.stateNotifications[this.owner.owner.states.NOT_PLACED].push(function(){
      self.sprites.face.hide();
      self.sprites.weapon.hide();
      self.owner.rock.display.hide();
    });
    this.owner.owner.stateNotifications[this.owner.owner.states.UNDER_CONSTRUCTION].push(function(){
      self.sprites.face.show()
      self.sprites.weapon.show()
    });
    this.owner.owner.stateNotifications[this.owner.owner.states.UPGRADING].push(function(){
      self.sprites.face.show();
      self.sprites.weapon.show();
    });
    this.owner.owner.stateNotifications[this.owner.owner.states.NORMAL].push(function(){
      self.sprites.face.show()
      self.sprites.weapon.show()
    });
  },

  render : function() {
    this.registerAnimation();
    this.sprites.weapon.setZIndex(this.displayPriority[this.owner.angle]);
    for(var sprite in this.sprites){
      this.sprites[sprite].render();
    }
    this.owner.rock.display.render();
  },

  registerAnimation : function() {
    if(this.owner.attacked == false)
    {
      this.sprites.weapon.currentAnimationFrame = 0;
      this.animated = false;
      this.owner.rock.display.stopAnimation();
    }  
    else if(this.owner.attacked == true && this.animated == false)
    {
      this.animated = true;
      Sounds.play(Sounds.gameSounds.slingshot)
    }
    if(this.owner.attacked == true && this.animated == true)
    {
      this.sprites.weapon.currentAnimationFrame += 1;
//      console.log("Weapon Render :: ", this.sprites.weapon.currentAnimationFrame, "  ::  ", this.owner.id);
      this.owner.rock.display.animate();   	 
      if(this.sprites.weapon.currentAnimationFrame == this.sprites.weapon.noOfAnimationFrames)
      {
        this.sprites.weapon.currentAnimationFrame = 0;
        this.animated = false;
        this.owner.rock.display.stopAnimation();
      }
    }    
  }

/*  registerAnimation : function() {
    if(this.owner.attacked == true && this.animated == false)
    {
      this.animated = true;
      var self = this
  	  Sounds.play(Sounds.gameSounds.slingshot)
      condition = function(){
        var status = (self.sprites.weapon.currentAnimationFrame == self.sprites.weapon.noOfAnimationFrames-1);
        return (status); 
      }
      mainFunc = function(){
        self.sprites.weapon.currentAnimationFrame += 1;
        console.log("Weapon Render :: ", self.owner.id, self.sprites.weapon.currentAnimationFrame);
        self.owner.rock.display.animate();
      } 
      callback = function(){
        self.sprites.weapon.currentAnimationFrame = 0;
        self.animated = false;
        self.owner.rock.display.stopAnimation();
      }
      this.owner.game.reactor.pushPeriodicalWithCondition(1 , mainFunc, condition, callback);
    }    
  }*/

});

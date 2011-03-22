WeaponDisplay = Class.create( Display, {

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
  },

  createSprites : function(){
    this.faceImg = Loader.images.buildings['wedge_face.png'];
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
    this.owner.rock.display.render();
    this.sprites.weapon.setZIndex(this.displayPriority[this.owner.angle]);
    for(var sprite in this.sprites){
      this.sprites[sprite].render();
    }
    if(this.owner.attacked == true && this.animated == false)
    {
      this.animated = true;
      var self = this
	  Sounds.play(Sounds.gameSounds.slingshot)
      condition = function(){
        return ( self.sprites.weapon.currentAnimationFrame == self.sprites.weapon.noOfAnimationFrames -1 || self.owner.attacked == false); 
      }
      mainFunc = function(){
        self.sprites.weapon.currentAnimationFrame += 1;
        self.owner.rock.display.animate();
      } 
      callback = function(){
        self.sprites.weapon.currentAnimationFrame = 0;
        self.animated = false;
        self.owner.rock.display.stopAnimation();
        self.owner.fire();
      }
      this.owner.game.reactor.pushPeriodicalWithCondition(2 , mainFunc, condition, callback)
    }
  },

});

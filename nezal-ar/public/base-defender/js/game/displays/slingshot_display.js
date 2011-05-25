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
    this.owner.game.scene.pushAnimation(this);
    this.shotClass = eval((this.owner.owner.shot + '_display').dasherize().capitalize().camelize())
    this.owner.shot.display = new this.shotClass(this.owner.shot, properties, this.container);
    this.manageStateChange();
    this.id = parseInt(Math.random() * 10000);
  },

  createSprites : function(){
    this.faceImg = Loader.images.buildings[this.owner.owner.name + '_face.png'];
    this.weaponImg = Loader.images.weapons[this.owner.name + ".png"];
    this.sprites.face = this.container.newDomImgSprite(this.owner, {img: this.faceImg},null,'slingshot');
    this.sprites.weapon = this.container.newDomImgSprite(this.owner, {img: this.weaponImg});
  },

  manageStateChange : function(){
    var self = this;
    this.owner.owner.stateNotifications[this.owner.owner.states.NOT_PLACED].push(function(){
      self.sprites.face.hide();
      self.sprites.weapon.hide();
      self.owner.shot.display.hide();
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
    this.owner.shot.display.render();
  },

  registerAnimation : function() {
    if(this.owner.owner.state == this.owner.owner.states.NORMAL)
    {
      if(this.owner.attacked == false)
      {
        this.sprites.weapon.currentAnimationFrame = 0;
        this.animated = false;
        this.owner.shot.display.stopAnimation();
      }  
      else if(this.owner.attacked == true && this.animated == false)
      {
        this.animated = true;
        Sounds.play(Sounds.gameSounds.slingshot)
      }
      if(this.owner.attacked == true && this.animated == true)
      {
        this.sprites.weapon.currentAnimationFrame += 1;
        this.owner.shot.display.animate();   	 
        if(this.sprites.weapon.currentAnimationFrame == this.sprites.weapon.noOfAnimationFrames)
        {
          this.sprites.weapon.currentAnimationFrame = 0;
          this.animated = false;
          this.owner.shot.display.stopAnimation();
          this.owner.fire();
        }
      }
/*      if(game.attackManager.attacking)
        console.log("Weapon Render :: ", this.owner.id, " :: " , this.sprites.weapon.currentAnimationFrame, " :: ", this.animated);*/
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

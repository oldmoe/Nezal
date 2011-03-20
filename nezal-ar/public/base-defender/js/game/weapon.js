var Weapon = Class.create({

  angle : 0,
  targetAngle : 5,
  imgHeight : 93,
  imgWidth : 64,
  
  name : null,
  game : null,
  specs : null,
  attacked : false,

  initialize : function(name, owner) {
    this.name = name;
    this.coords = owner.coords;
    this.game = owner.game;
    this.owner = owner;
    var newAngle = Math.round(Math.random() * 10 );
    this.angle = newAngle % 8;
    this.specs = this.game.data.weapons[this.name].specs;
		this.game.scene.push(this);
    var self = this;
  	this.game.scene.pushPeriodicalRenderLoop(1,1,2,function() {self.randomDirectionChange()});
  	this.game.scene.pushPeriodicalRenderLoop(2,4,1,function() {self.changeAngle()});
    this.rock = new Rock(this);
  },

  tick : function() {
    if(this.owner.state == this.owner.states.NORMAL)
    {
      this.attacker = this.checkAttack();
      if ( this.attacker ) {
        this.attacked = true;
        this.angle = Map.getGeneralDirectoin(this.coords.x, this.coords.y, this.attacker.coords.x, this.attacker.coords.y);
      }else {
        this.attacked = false;
      }
    }
  },

  checkAttack : function() {
    if(this.owner.hp <=1 || this.attacker)
      return;
    var attack = null;
    var minHp = 50000;
    var minDistance = 150;
    for( var i = 0 ; i < this.game.creepFactory.registery.length; i++ )
    {
      var creep = this.game.creepFactory.registery[i];
      var dist = Util.distance(this.coords.x, this.coords.y, creep.coords.x, creep.coords.y);
      if(dist < minDistance)
      {
        if(creep.hp < minHp)
        {
          minHp = creep.hp;
          attack = creep;
        }
      }
    }
    return attack;
  },

  fire : function() {
    if( this.owner.hp <=1 )
    {
      this.attacked = false;
      this.attacker = null;
      return;
    }      
    if(this.attacker)
      this.attacker.hp -= this.specs.power;
    this.attacked = false;
    this.attacker = null;
  },
  
  randomDirectionChange : function() {
    if( this.owner.state == this.owner.states.NORMAL && this.attacked == false ) {
      var newAngle = Math.round(Math.random() * 10 );
      this.targetAngle = newAngle % 8;
    }
  },

  changeAngle : function() {
    if( this.owner.state == this.owner.states.NORMAL && this.attacked == false ) {
		  if(this.angle > this.targetAngle){
			  if((this.targetAngle+8) - this.angle < this.angle - this.targetAngle){
				  this.angle = (this.angle+1) % 8 
			  }else{
				  this.angle = (this.angle+7) % 8
			  }
		  }else if (this.angle < this.targetAngle){
			  if(this.targetAngle - this.angle < (this.angle+8) - this.targetAngle){
				  this.angle = (this.angle+1) % 8 
			  }else{
				  this.angle = (this.angle+7) % 8
			  }
		  }			
    }
  }


});

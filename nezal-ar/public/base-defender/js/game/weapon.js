var Weapon = Class.create({

  angle : 5,
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
  },

  tick : function() {
    this.attacker = this.checkAttack();
    if ( this.attacker ) {
      this.attacked = true;
      this.angle = Map.getGeneralDirectoin(this.coords.x, this.coords.y, this.attacker.coords.x, this.attacker.coords.y);
    }else {
      this.attacked = false;
    }
  },

  checkAttack : function() {
    if(this.owner.hp<=1 || this.attacker)
      return;
    var attack = null;
    var minDistance = 150;
    for( var i = 0 ; i < this.game.creepFactory.registery.length; i++ )
    {
      var creep = this.game.creepFactory.registery[i];
      var dist = Util.distance(this.coords.x, this.coords.y, creep.coords.x, creep.coords.y);
      if(dist < minDistance)
      {
        minDistance = dist;
        attack = creep;
      }
    }
    return attack;
  },

  fire : function() {
    if(this.owner.hp <=1 || this.attacker.hp < 1)
    {
      this.attacked = false;
      this.attacker = null;
      return;
    }      
    this.attacker.hp -= this.specs.power;
  },
  
  randomDirectionChange : function() {
    if( this.owner.state == this.owner.states.NORMAL && this.attacked == false ) {
      var newAngle = Math.round(Math.random() * 10 );
      this.angle = newAngle % 8;
    }
  }

});

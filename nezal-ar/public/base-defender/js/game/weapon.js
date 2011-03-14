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
    var attack = null;
    var minDistance = 150;
    for( i in this.game.attackManager.creeps )
    {
      var creep = this.game.attackManager.creeps[i];
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
    this.attacker.hp -= this.specs.power;
    console.log(this.game.attackManager.creeps)
  },
  
  randomDirectionChange : function() {
    if( this.owner.state == this.owner.states.NORMAL && this.attacked == false ) {
      var newAngle = Math.round(Math.random() * 10 );
      this.angle = newAngle % 8;
    }
  }

});

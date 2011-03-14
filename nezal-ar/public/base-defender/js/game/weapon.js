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
    this.specs = this.game.data.weapons[this.name].specs;
		this.game.scene.push(this);
    var self = this;
  	this.game.scene.pushPeriodicalRenderLoop(1,1,2,function() {self.randomDirectionChange()});
    this.randomDirectionChange();
  },

  tick : function() {
    this.attacker = this.checkAttack();
    if ( this.attacker ) {
      this.attacked = true;
      this.angle = Map.getGeneralDirectoin(this.coords.x, this.coords.y, attacker.coords.x, attacker.coords.y);
    } 
  },

  checkAttack : function() {
    var attacker = null;
    for( i in this.game.attackManager.creeps )
    {
      var creep = this.game.attackManager.creeps[i];
      var distance = Util.distance(this.coords.x, this.coords.y, creep.coords.x, creep.coords.y);
      if(distance < this.specs.range*100)
      {
        attacker = creep;
      }
    }
    return attacker;
  },
  
  randomDirectionChange : function() {
    if( this.owner.state == this.owner.states.NORMAL && this.attacked == false ) {
      var newAngle = Math.round(Math.random() * 10 );
      this.angle = newAngle % 8;
    }
  }

});

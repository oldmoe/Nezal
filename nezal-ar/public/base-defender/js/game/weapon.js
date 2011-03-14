var Weapon = Class.create({

  angle : 5,
  imgHeight : 93,
  imgWidth : 64,

  name : null,
  game : null,

  initialize : function(name, owner) {
    this.name = name;
    var angle = Math.round(Math.random() * 10 )
    this.angle = angle % 8 ;
    this.coords = owner.coords;
    this.game = owner.game;
    this.owner = owner;
  }
  
});

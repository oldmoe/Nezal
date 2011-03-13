var Weapon = Class.create({

  angle : 5,
  imgHeight : 93,
  imgWidth : 64,

  name : null,
  game : null,

  initialize : function(name, owner) {
    this.name = name;
    this.coords = owner.coords;
    this.game = owner.game;
  }
  
});

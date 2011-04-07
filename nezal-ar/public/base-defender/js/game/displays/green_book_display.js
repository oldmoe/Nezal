var GreenBook = Class.create( Rock, {

  imgHeight : 30,
  imgWidth : 25,
  width : 25,
  height : 30,

  position : {
    0 : {x : 16, y : 38, zIndex : 5 }, 
    1 : {x : 16, y : 22, zIndex : 2 },
    2 : {x : 6, y : 25, zIndex : 2 },
    3 : {x : 23, y : 22, zIndex : 2 }, 
    4 : {x : 29, y : 38, zIndex : 5 }, 
    5 : {x : 18, y : 24, zIndex : 2 }, 
    6 : {x : 16, y : 32, zIndex : 5 }, 
    7 : {x : 26, y : 23, zIndex : 2 }
  },

  position2 : {
    0 : {x : 46, y : 36, zIndex : 5 }, 
    1 : {x : 34, y : 6, zIndex : 2 },
    2 : {x : 6, y : 13, zIndex : 2 },
    3 : {x : 4, y : 6, zIndex : 2 }, 
    4 : {x : 0, y : 32, zIndex : 5 }, 
    5 : {x : 0, y : 30, zIndex : 2 }, 
    6 : {x : 15, y : 35, zIndex : 5 }, 
    7 : {x : 42, y : 32, zIndex : 2 }
  },
  
});

var GreenBookDisplay = Class.create( RockDisplay, {

  render : function($super) {
    this.owner.angle = this.owner.owner.angle
    $super();
  },

});

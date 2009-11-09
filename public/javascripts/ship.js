var Ship = {
  
  HORIZONTAL : 0,
  VERTICAL : 1,
  
  init : function(length){
    this.length = length;
    this.orientation = Ship.HORIZONTAL; // 0 = horizontal, 1 = vertical
    return this;
  }
} 

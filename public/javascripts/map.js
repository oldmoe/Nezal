var Map = []

Map.init = function(x, y){
  console.log("map initialized with : "+x+", "+y)
  for(var i = 0; i < x; i++){
    var col = []
    for(var j = 0; j < y; j++){ 
      col.push(null) 
    }
    this.push(col);
  }
  this._draw();
  return this; 
}

Map._draw = function(){
  for(var y = 0; y < this[0].length; y++){
    var row = [];
    for(var x = 0; x < this.length; x++){
      row.push(this[x][y])
    }
    console.log(row)
  } 
}

var Game = {
  load : function(){
    battleship= new Battleship();
    battleship.draw();
  },
  
  destroy : function(){
  }  
}
  
function Battleship()
{
  this.canvas = document.getElementById("gameCanvas");
  this.context = this.canvas.getContext("2d");
  this.seaImage = new Image()   
  this.seaImage.src = "images/sea.jpg"

  this.drawGrid = function(x, y){
    
    var pitch = 32
    chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    for(var i = 0; i < 9; i++){
      if(i < 8)
        this.context.fillText(chars[i], x + (i)* pitch + (pitch/3)  , y - 10)
      this.context.beginPath()
      this.context.moveTo(x + i*pitch,y)
      this.context.lineTo(x + i*pitch, y + pitch * 8)
      this.context.closePath()
      this.context.stroke() 
    }
    for(var i = 0; i < 9; i++){
      if(i < 8)
        this.context.fillText(i+1, x - pitch/2   , y + (i+1)* pitch - (pitch/3))
      this.context.beginPath()
      this.context.moveTo(x, y + i*pitch)
      this.context.lineTo(x + pitch * 8, y + i*pitch)
      this.context.closePath()
      this.context.stroke() 
    }
  }

  this.draw = function(){
    this.context.drawImage(this.seaImage, 0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = "#dde"
    this.context.font = "bold 14px verdana"
    this.context.fillStyle = "rgba(255,255,255,1)";
    this.drawGrid(40,80);
    this.drawGrid(this.canvas.width - (40 + 8 * 32) ,80);
  }
  
}

var oldfunc = window.onload

if(oldfunc){
  window.onload = function(){
    if(typeof oldfunc == Function){
      oldfunc();
    }else{
      eval(oldfunc)
    }
    Game.load();
  }
}else{
  window.onload = Game.load
}



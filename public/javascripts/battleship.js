var Game = {
  load : function(){
    battleship= new Battleship();
    battleship.draw();
  },
  
  destroy : function(){
  }  
}
  
function Ship(parent, x, y, width){
  this.parent = parent
  this.x = x
  this.y = y
  this.width = width
  this.image = new Image();
  this.image.src = "images/ship-" + parent.pitch * width + ".png"
  this.background = null
  this.saveBackground = function(x, y){
    this.background = {x: x, y: y, image: this.parent.context.getImageData(x, y, this.width * this.parent.pitch, this.parent.pitch)}
  }
  
  this.draw = function(){
    try{
    if(this.background != null){
      this.parent.context.putImageData(this.background.image, this.background.x, this.background.y)
    }
    this.saveBackground(this.x, this.y)
    this.parent.context.drawImage(this.image, this.x, this.y)
    }catch(e){alert(e)}
  }
}


function Battleship()
{
  this.canvas = document.getElementById("gameCanvas");
  this.context = this.canvas.getContext("2d");

  this.seaImage = new Image();   
  
  this.pitch = 32;
  this.selectedShip = null;
  var gridXPos = 40;
  var gridYPos = 70;  
  var numOfColumns = 8;
  var that = this;
  
  /* The following xPos, yPos for the canvas should come from 
   * somewhere that I don't know about yet so I will set them 
   * buy hand for now
   * done!
   */
  this.canvas.xPos = this.canvas.offsetLeft;
  this.canvas.yPos = this.canvas.offsetTop;

  this.ships = [];
  
  this.init = function(){
    var pitch = this.pitch
    /* Load Background Image
     */
    that.seaImage.src = "images/sea.jpg";
    /* Initialize ships and set their location 
     * This location shall change when the player place them on the  board
     * Each element in the list has an X, Y, Width in number of cells to occupy
     */
    shipsYPos = gridYPos + pitch*(numOfColumns+1);
    that.ships[0] = new Ship(that, that.canvas.width/2-pitch/2, shipsYPos, 1);
    that.ships[1] = new Ship(that, that.canvas.width/10*3-pitch/2, shipsYPos+pitch*1.3, 1);
    that.ships[2] = new Ship(that, that.canvas.width/2-3*pitch/2, shipsYPos+pitch*1.3, 3);
    that.ships[3] = new Ship(that, that.canvas.width/10*7-pitch/2, shipsYPos+pitch*1.3, 1);
    that.ships[4] = new Ship(that, that.canvas.width/10*3+pitch/2, shipsYPos+2.6*pitch, 2);
    that.ships[5] = new Ship(that, that.canvas.width/10*6-pitch/2, shipsYPos+2.6*pitch, 2);
  }

  this.drawGrid = function(x, y){
    var pitch = this.pitch
    chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    for(var i = 0; i < numOfColumns+1; i++){
      if(i < numOfColumns)
        this.context.fillText(chars[i], x + (i)* pitch + (pitch/3)  , y - 10)
      this.context.beginPath()
      this.context.moveTo(x + i*pitch,y)
      this.context.lineTo(x + i*pitch, y + pitch * numOfColumns)
      this.context.closePath()
      this.context.stroke() 
    }
    for(var i = 0; i < numOfColumns+1; i++){
      if(i < numOfColumns)
        this.context.fillText(i+1, x - pitch/2   , y + (i+1)* pitch - (pitch/3))
      this.context.beginPath()
      this.context.moveTo(x, y + i*pitch)
      this.context.lineTo(x + pitch * numOfColumns, y + i*pitch)
      this.context.closePath()
      this.context.stroke() 
      this.context.fill() 
    }
  }

  this.scatterShips = function(){
    var pitch = this.pitch
    for(var i=0; i < that.  ships.length; i++)
    {
      that.context.drawImage(that.ships[i].image, that.ships[i].x, that.ships[i].y, pitch*that.ships[i].width, pitch);
    }
  }

  this.shipSelected = function(i){
    this.canvas.style.cursor = "none";
    this.selectedShip = this.ships[i]
    var that = this
    this.canvas.onmousemove = function(event){
      // check if mouse is inside the grid
      // check if it moved to a new grid block
      // if true then draw the old background in the old block(s)
      // then save the new background
      // then draw the ship in the new location
      that.selectedShip.x = event.pageX - that.canvas.xPos
      that.selectedShip.y = event.pageY - that.canvas.yPos
      that.selectedShip.draw()
    }
  }

  this.draw = function(){
    var pitch = this.pitch
    this.init();  
    this.context.drawImage(this.seaImage, 0, 0, this.canvas.width, this.canvas.height);  
    this.context.strokeStyle = "#dde"
    this.context.font = "bold 14px verdana"
    this.context.fillStyle = "rgba(255, 255, 255, 1)";
    this.drawGrid(gridXPos, gridYPos);
    this.drawGrid(this.canvas.width - (gridXPos + numOfColumns*pitch), gridYPos);
    this.scatterShips();
  }
  
  this.onClick  =  function (evt) {
    var pitch = that.pitch
    if(that.selectedShip != null){
     return;
    }
    for(var i=0; i < that.ships.length; i++)
    {
        if ( evt.pageX-that.canvas.xPos  > that.ships[i].x  && evt.pageX-that.canvas.xPos < that.ships[i].x+that.ships[i].width*pitch && 
            evt.pageY-that.canvas.yPos > that.ships[i].y && evt.pageY-that.canvas.yPos < that.ships[i].y+pitch ) {
            that.context.fillStyle = "rgba(255, 255, 255, 0.4)";
            that.context.fillRect(that.ships[i].x, that.ships[i].y, pitch*that.ships[i].width, pitch);
/*            that.context.drawImage(that.seaImage, that.ships[i].x*that.seaImage.width/that.canvas.width, that.ships[i].y*that.seaImage.height/that.canvas.height, 
                pitch*that.ships[i].width*that.seaImage.width/that.canvas.width , pitch*that.seaImage.height/that.canvas.height, 
                that.ships[i].x, that.ships[i].y, pitch*that.ships[i].width, pitch);*/
            that.context.drawImage(that.ships[i].image,  that.ships[i].x, that.ships[i].y, pitch*that.ships[i].width, pitch);
            that.shipSelected(i)
            
          break;
        }
    }
  }
  this.canvas.onclick=this.onClick;     
  
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




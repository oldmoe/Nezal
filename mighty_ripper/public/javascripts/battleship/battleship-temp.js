  var Game = {
    load : function(){
      battleship= new Battleship();
      battleship.draw();
    },
    
    destroy : function(){
    }  
  }
    
  function Ship(parent, x, y, width, direction){
  
    this.parent = parent
    this.x = x
    this.y = y
    this.background = null
    
    this.saveBackground = function(x, y){
      this.background = {x: x, y: y, image: this.parent.context.getImageData(x, y, this.width * this.parent.pitch, this.height*this.parent.pitch)}
    }
    
    this.drawMove = function(){
      try{
      if(this.background != null){
        this.parent.context.putImageData(this.background.image, this.background.x, this.background.y)
      }
      this.saveBackground(this.x, this.y)
      this.parent.context.drawImage(this.image, this.x, this.y)
      }catch(e){}//alert(e)}
    }
    
    this.draw = function(){   
      if(this.originalPlace != null){
        this.parent.context.putImageData(this.originalPlace.image, this.originalPlace.x, this.originalPlace.y)
      }
      this.originalPlace = {x: x, y: y, image: this.parent.context.getImageData(x, y, this.width*this.parent.pitch, this.height*this.parent.pitch)};
      this.parent.context.drawImage(this.image, this.x, this.y)
    }
    
    this.highlight = function(){
      this.parent.context.fillRect(this.x, this.y, this.width*this.parent.pitch-1, this.height*this.parent.pitch);
    }
        
    this.setDirection = function(direction){
      if(direction == 0 ){
        this.width = width;
        this.height = 1;
      }else{
        this.width = 1;
        this.height = width;
      }
      this.direction = direction;
      this.image = new Image();
      this.imageDir = ["", "-vert"]
      this.image.src = "images/ship-" + parent.pitch * width + this.imageDir[direction]+ ".png"
    }    
    
    this.setDirection(direction);
        
  }
  
  /*
   * This object is resposible for drawing the grid displaying the options
   * for the direction of the ship (horizontal, vertical)
   */
  function DirectionGrid(parent, x, y){
  
    this.xPos = x;
    this.yPos = y;
    this.parent = parent;
    this.background = null;
    this.ships = []; 
          
    var that = this;
    
    this.saveBackground = function(x, y){
      this.background = {x: x, y: y, image: this.parent.context.getImageData(x, y, that.width, that.height)}
    }
    
    function init()
    {
      that.width = that.parent.pitch*3;
      that.height = that.parent.pitch+10;
      that.ships[0] = new Ship(that.parent, that.xPos + that.width/10, that.yPos, 1, 0);
      that.ships[1] = new Ship(that.parent, that.xPos + that.width - that.width/10 - that.parent.pitch, that.yPos, 1, 1);
    }

    this.highlight = function() {
      that.parent.context.fillStyle = "rgba(255, 255, 255, 0.4)";
      that.parent.context.fillRect(that.xPos, that.yPos-5, that.width, that.height);
    }
    
    /*
     * Draw Vertical or horizontal direction option grid and highlight 
     * the selected option
     */
    this.draw = function(){
      if(that.background == null)
      {
        that.saveBackground(that.xPos, that.yPos);
      }
      that.parent.context.clearRect(that.xPos, that.yPos-5, that.width, that.height);
      that.parent.context.putImageData(that.background.image, that.xPos, that.yPos-5);
      that.highlight();
      that.ships[0].draw();
      that.ships[1].draw();
      that.ships[that.parent.shipDirection].highlight();
    }    
    
    init();
    
  }
  
  /*
   * PlayGrids with their data, drawing and all the bla bla
   */
  function PlayGrid(parent, x, y, columns)
  {
    this.canvas = document.getElementById("gridCanvas");
    this.context = this.canvas.getContext("2d");
//      top:410px;
//    this.canvas.xPos = this.canvas.offsetLeft;
//    this.canvas.yPos = this.canvas.offsetTop;
  
    this.xPos = x;
    this.yPos = y;
    this.parent = parent;
    this.numOfColumns = columns;
    this.map = AI.initMap(this.numOfColumns, this.numOfColumns);
    this.highlightOnly=0;

    /* xPos, yPos for the canvas 
     */ 
    this.canvas.style.position = "absolute";
    this.canvas.style.left = this.parent.canvas.offsetLeft;
    this.canvas.style.top = this.parent.canvas.offsetTop;
    
    var that = this;  
    
    this.background = null;
    
    this.saveBackground = function(x, y, width, height){
      this.background = {x: x, y: y, width:width, height:height, image: that.context.getImageData(x, y, width, height)};
    }

    this.highlight = function(x, y){
      if(this.background != null){
//        this.parent.context.drawImage(that.parent.background, this.background.x, this.background.y, this.background.width, this.background.height,
//            this.background.x, this.background.y, this.background.width, this.background.height);
//        that.context.putImageData(this.background.image, this.background.x, this.background.y)        
      }
      this.saveBackground(x, y, that.parent.selectedShip.width*that.parent.pitch,
            that.parent.selectedShip.height*that.parent.pitch);
      that.context.fillStyle = "rgba(255, 255, 255, 0.4)";
      that.context.beginPath();
/*      that.context.fillRect(x, y, that.parent.selectedShip.width*that.parent.pitch,
            that.parent.selectedShip.height*that.parent.pitch);*/
      that.context.fillRect(10,10,100, 100);
      that.context.closePath();
    }
    
    this.draw = function(){
      var pitch = that.parent.pitch
      chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      for(var i = 0; i < that.numOfColumns+1; i++){
        if(i < that.numOfColumns)
          that.parent.context.fillText(chars[i], x + (i)* pitch + (pitch/3)  , y - 10)
        that.parent.context.beginPath()
        that.parent.context.moveTo(x + i*pitch,y)
        that.parent.context.lineTo(x + i*pitch, y + pitch * that.numOfColumns)
        that.parent.context.closePath()
        that.parent.context.stroke() 
      }
      for(var i = 0; i < that.numOfColumns+1; i++){
        if(i < that.numOfColumns)
          that.parent.context.fillText(i+1, x - pitch/2   , y + (i+1)* pitch - (pitch/3))
        that.parent.context.beginPath()
        that.parent.context.moveTo(x, y + i*pitch)
        that.parent.context.lineTo(x + pitch * that.numOfColumns, y + i*pitch)
        that.parent.context.closePath()
        that.parent.context.stroke() 
      }
    }
    
    /* This method checks that the user has clicked to place
     * the ship on valid(empty) place on the grid. If yes, it 
     * places the ship and return true else it returns false
     */
    this.placeShip = function(cursorX, cursorY){
      var column = Math.round(cursorX/that.parent.pitch);
      var row = Math.floor((cursorY+that.parent.pitch/2)/that.parent.pitch);
      var size = that.parent.selectedShip.width + that.parent.selectedShip.height -1;
      var increaseColumn = 1; 
      var increaseRow = 0; 
      if(that.parent.selectedShip.direction){
        increaseColumn = 0; 
        increaseRow = 1; 
      }
      
      for(var i=0; i< size; i++)
      {
        if(column+i*increaseColumn < that.numOfColumns && 
              row+i*increaseRow < that.numOfColumns && that.map[row+i*increaseRow][column+i*increaseColumn] == null )
        {
          if(that.highlightOnly==0)
            that.map[row+i*increaseRow][column+i*increaseColumn] = that.selectedShip;
        }else{
          while((i-=1)>-1)
          {
            that.map[row+i*increaseRow][column-i*increaseColumn] = null;
          }
          return false
        }
      }
      
      if(that.highlightOnly!=0){
         console.log("fjdsfs") ;
         that.highlight(that.xPos + column*that.parent.pitch, that.yPos + row*that.parent.pitch);
      } else {
        that.parent.selectedShip.y = that.yPos + row*that.parent.pitch;
        that.parent.selectedShip.x = that.xPos + column*that.parent.pitch;
      }
      return true;
    }
    
    /* This method checks that the user has clicked on the grid
     * on an occupied position, Thus meaning to move the ship from
     * its current position and free the occupied cells accordingly
     */
    this.freeGrid = function(cursorX, cursorY){
      var column = Math.floor(cursorX/that.parent.pitch);
      var row = Math.floor((cursorY+that.parent.pitch/2)/that.parent.pitch);
      console.log(row + ".." + column + ".." + that.map[row][column]);
      
      if(that.map[row][column] != null )
      {
        var ship = that.map[row][column];
        console.log("ship detected");
      } 
    }

  }

  function Battleship()
  {
    this.canvas = document.getElementById("gameCanvas");
    this.context = this.canvas.getContext("2d");

    this.pitch = 32;
    this.shipDirection = 0;
    this.selectedShip = null;
    this.ships = [];
    this.playGrids = [];
    this.background = null;    
    this.seaImage = new Image();       
    /* xPos, yPos for the canvas 
     */
    this.canvas.xPos = this.canvas.offsetLeft;
    this.canvas.yPos = this.canvas.offsetTop;

    var that = this;
    var gridXPos = 40;
    var gridYPos = 70;    
    var numOfColumns = 8;
    
    /* 
     * Initialize: load Images that need loading .. Set the ships positions
     */
    this.init = function(){
      var pitch = this.pitch
      /* Initialize the directionGrid
       */
      that.directionGrid =  new DirectionGrid(this, gridXPos, gridYPos + that.pitch*(numOfColumns+1))
      /* Initialize the main PlayGrid
       */
      that.playGrids[0] =  new PlayGrid(this, gridXPos, gridYPos, numOfColumns);
      that.playGrids[1] =  new PlayGrid(this, this.canvas.width - (gridXPos + numOfColumns*pitch), gridYPos, numOfColumns);
      /* Load Background Image
       */
      that.seaImage.src = "images/sea.jpg";
      /* Initialize ships and set their location 
       * This location shall change when the player place them on the  board
       * Each element in the list has an X, Y, Width in number of cells to occupy
       */
      that.shipsYPos = gridYPos + pitch*(numOfColumns+1);
      that.shipsXPos = that.directionGrid.width + gridXPos + that.pitch;
      delta = (that.canvas.width - gridXPos - that.shipsXPos - that.pitch*10)/5;
      that.ships[0] = new Ship(that, that.shipsXPos, that.shipsYPos, 1, 0);
      that.ships[1] = new Ship(that, that.shipsXPos + pitch + delta, that.shipsYPos, 1, 0);
      that.ships[2] = new Ship(that, that.shipsXPos + pitch*2 + delta*2, that.shipsYPos, 1, 0);
      that.ships[4] = new Ship(that, that.shipsXPos + pitch*3 + delta*3, that.shipsYPos, 2, 0);
      that.ships[5] = new Ship(that, that.shipsXPos + pitch*5 + delta*4, that.shipsYPos, 2, 0);
      that.ships[3] = new Ship(that, that.shipsXPos + pitch*7 + delta*5, that.shipsYPos, 3, 0);
    }
    
    this.scatterShips = function(){
      for(var i=0; i < that.  ships.length; i++)
      {
        that.ships[i].draw();
      }
    }

    this.shipSelected = function(i){
      this.selectedShip = this.ships[i]
      this.selectedShip.highlight();
      this.selectedShip.setDirection(this.shipDirection);

      var that = this
      this.canvas.onmousemove = function(event){
        // check if mouse is inside the grid
        // check if it moved to a new grid block
        // if true then draw the old background in the old block(s)
        // then save the new background
        // then draw the ship in the new location
        if(that.selectedShip != null)
        {
          that.selectedShip.x = event.pageX - that.canvas.xPos
          that.selectedShip.y = event.pageY - that.canvas.yPos
          that.selectedShip.drawMove();
          that.playGrids[0].highlightOnly = 1;
          that.playGrids[0].placeShip(event.pageX-that.canvas.xPos-gridXPos, event.pageY-that.canvas.yPos-gridYPos); 
        }
      }
    }
        
    /*
     * Draw the basic canvas, the backgound, the grid and the ships
     */
    this.draw = function(){
      this.init();  
      this.context.drawImage(this.seaImage, 0, 0, this.canvas.width, this.canvas.height);  
      this.context.strokeStyle = "#dde"
      this.context.font = "bold 14px verdana"
      this.context.fillStyle = "rgba(255, 255, 255, 1)";
      this.playGrids[0].draw();
      this.playGrids[1].draw();
      this.scatterShips();
      this.directionGrid.draw();
    }
    
    this.onClick  =  function (evt) {
      var pitch = that.pitch

      evt.canvasX = evt.pageX-that.canvas.xPos;
      evt.canvasY = evt.pageY-that.canvas.yPos;      
      
      if(that.selectedShip === null){
        for(var i=0; i < that.ships.length; i++)
        {
            if ( evt.pageX-that.canvas.xPos  > that.ships[i].x  && evt.pageX-that.canvas.xPos < that.ships[i].x+that.ships[i].width*pitch && 
                evt.pageY-that.canvas.yPos > that.ships[i].y && evt.pageY-that.canvas.yPos < that.ships[i].y+pitch*that.ships[i].height ) {
                that.shipSelected(i);
              break;
            }
        }
        if(evt.canvasX > that.directionGrid.ships[0].x && evt.canvasX < that.directionGrid.ships[0].x+that.pitch &&
           evt.canvasY > that.directionGrid.ships[0].y && evt.canvasY < (that.directionGrid.ships[0].y + pitch) )
        {
          that.shipDirection = 0;
          that.directionGrid.draw();
        }else if(evt.canvasX > that.directionGrid.ships[1].x && evt.canvasX < that.directionGrid.ships[1].x+that.pitch &&
           evt.canvasY > that.directionGrid.ships[1].y && evt.canvasY < (that.directionGrid.ships[1].y + pitch) )
        {
          that.shipDirection = 1;
          that.directionGrid.draw();
        }else if(evt.canvasX > gridXPos && evt.canvasX < (gridXPos + numOfColumns*pitch) &&
           evt.canvasY > gridYPos && evt.canvasY < (gridYPos + numOfColumns*pitch) )
        {
          that.playGrids[0].highlightOnly = 0;
          that.playGrids[0].freeGrid(evt.canvasX-gridXPos, evt.canvasY-gridYPos);
        }

      }else {
        if(evt.canvasX > gridXPos && evt.canvasX < (gridXPos + numOfColumns*pitch) &&
           evt.canvasY > gridYPos && evt.canvasY < (gridYPos + numOfColumns*pitch) )
        {
          that.playGrids[0].highlightOnly = 0;
          if(that.playGrids[0].placeShip(evt.canvasX-gridXPos, evt.canvasY-gridYPos) === true )
          {
            that.selectedShip.drawMove();
            that.selectedShip.draw();
            that.selectedShip = null;
          }
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




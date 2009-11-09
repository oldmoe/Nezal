var SimpleBattleship  = {

  init : function(players){

    var game = Battleship.clone(players);   
    
    var player = game.players[0];
    player.hasTurn = false
    player.play = function(){
      player.hasTurn = true;      
    }
    
    Aspect.before(game, "start", function(){
      /* Here we should get the dom and place the tables for the 
       * maps. Draw the ships somehow toooooooooo
       */ 
      
      var div = document.getElementById('game'); 
      var maps = [this.players[0].map, this.players[0].enemyMap];
      var tables = [];
      for(var i=0; i< maps.length; i++) 
      {
        tables[i] = document.createElement('table');
        tables[i] = div.appendChild(tables[i]);
        tables[i].setAttribute('class', 'grid')
        /* loop on every row*/
        for(var j=0; j<maps[i].length; j++)
        {
          var row = document.createElement('tr');
          row = tables[i].appendChild(row);
          /* loop on every column*/
          for(var k=0; k < maps[i][0].length; k++)
          {
              var cell = document.createElement('td');
              cell = row.appendChild(cell);
              cell.innerHTML = "&nbsp;"
              cell.setAttribute('_x', k)
              cell.setAttribute('_y', j)
              cell.setAttribute('id', i+"_"+k+"_"+j);
              if(i == 0){
                if(maps[i][k][j] != null){
                  cell.setAttribute('class', 'ship')
                }
              }else{
                var game = this
                cell.onclick = function(event){
                  if(!player.hasTurn) return;
                  player.hasTurn = false;
                  game.fireAt(event.target.getAttribute('_x'), event.target.getAttribute('_y'));
                  event.target.onclick = null;
                  window.setTimeout(function(){ game.turn() }, 10)
                }
              }              
          }
        }
      }
    });
    
    Aspect.after(game, 'fireAt', function(result, x, y){
      console.log(this.currentPlayer)
      var mapId = (this.currentPlayer + 1) % 2
      console.log("map id = "+mapId)
      var targetCell = document.getElementById(mapId + '_' + x + '_' + y)
      if(result){
         targetCell.setAttribute('class', 'hit')
      }else{
         targetCell.setAttribute('class', 'miss')
      }
      return result;
    });
                
    return game;   

  }

}

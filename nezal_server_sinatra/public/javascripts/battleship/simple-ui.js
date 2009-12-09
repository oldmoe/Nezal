var SimpleBattleship  = Object.cloneProto({

  init : function(players, player_num){
    
    var game = Battleship.cloneProto(players);   
    
    var player_num = player_num;
    
    game.player_num = player_num;
    
    var player = game.players[player_num];
    
    Aspect.before(game, "start", function(){
      /* Here we should get the dom and place the tables for the 
       * maps. Draw the ships somehow toooooooooo
       */ 
      
      var div = document.getElementById('game'); 
      
      /* Clearing any initial game already drawen 
       * within the div
       */
    	while (div.hasChildNodes())
	    {
	      div.removeChild(div.firstChild);
	    }
	    
	    /* Drawing the maps
	     */
      var maps = [];
      maps[player_num] = player.battleMap ;
      maps[(player_num+1)%2] =  player.enemyMap;
      var tables = [];
      for(var i=0; i< maps.length; i++) 
      {
        var playerGrid = document.createElement('div');
        playerGrid = div.appendChild(playerGrid);
        playerGrid.setAttribute('class', 'playerGrid')
        var title = document.createElement('div');
        title = playerGrid.appendChild(title);
        title.innerHTML= "Player : " + i
        title.setAttribute('class', 'title')
        tables[i] = document.createElement('table');
        tables[i] = playerGrid.appendChild(tables[i]);
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
              if(i == player_num){
                if(maps[i][k][j] != null){
                  cell.setAttribute('class', 'ship')
                }
              }else{
                var game = this
                cell.onclick = function(event){
                  if( !player.hasTurn) return;
                  player.hasTurn = false;
                  event.target.setAttribute('class', 'wait');                                
                  game.fireAt(event.target.getAttribute('_x'), event.target.getAttribute('_y'));  
                  event.target.onclick = null;
                }
              }              
          }
        }
      }
    });   
    
    Aspect.before(game, 'fireCallback', function( result, x, y, hitPoints){
      console.log("Inside Before fireCallback " + result)
      var mapId = (this.currentPlayer+1) % 2
      var targetCell = document.getElementById(mapId + '_' + x + '_' + y)
      if(result){
         targetCell.setAttribute('class', 'hit')
      }else{
         targetCell.setAttribute('class', 'miss')
      }
      return result;
    });
     
    Aspect.after(game, 'finish', function(){
      alert("Player: " + this.currentPlayer  +  "  Won" )
      console.log("Player: " + this.currentPlayer  +  "  Won" );
    });
    
    return game;   

  }

})

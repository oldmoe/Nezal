var GameEngine = {
  
  player_types : {  'viewer' : Viewer,
                    'player' : Player,
                 },
  
  opponent_types : {'viewer' : Viewer,
                    'network' : NetworkPlayer,
                    'computer' : ComputerPlayer,
                  },
  
  player : null,
  opponent : null,
  game : null,
  
  init : function(){
    this.player = this.player_types['viewer'];
    this.opponent = this.player_types['viewer'];
    this.setup(0);
  },
  
  setup: function(player_num){
    var total_players = 2;
    var players = [];
      
    for(var i=0; i<total_players; i++){
      if(i==player_num){
        players[i] = this.player.cloneProto(8, 8);
      }else{
        players[i] = this.opponent.cloneProto(8, 8);
      }
    }
              
    this.game = SimpleBattleship.cloneProto(players, player_num);
           
    this.game.start();
      
    if(player_num == 0){
      players[0].play()
    }
  },

  join : function(player_num){
    this.player = this.player_types['player'];
    this.opponent = this.opponent_types['network'];
    this.setup(player_num);  
  }, 
  
  process : function(data){
    event = data["data"].evalJSON(true)
    if(event.event == "fire"){
      result = this.game.players[this.game.player_num].hitAt(event.x, event.y)
    }else if (event.event == "result"){
      this.game.fireCallback(event.result, event.x, event.y, event.hitPoints)
    }
  },
  
}

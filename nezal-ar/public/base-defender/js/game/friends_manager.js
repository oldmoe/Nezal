var FriendsManager = Class.create({
   //This should choose the suitable social network for the game
   friendIds : null,
   friendWeight : 100,
   attackWeight : 15,
   levelWeight : 35,
   initialize : function(game){
    this.game = game
    this.getFriends()
   },
   getFriends :function(){
        var self = this
				userID = FB.getSession().uid
				var	query = FB.Data.query("SELECT uid FROM user WHERE is_app_user=1 and uid IN (SELECT uid2 FROM friend WHERE uid1 = {0})", FB.getSession().uid);
				FB.Data.waitOn([query], function(){
					if(!query.value.length)query.value=[]
					self.friendIds = query.value.collect(function(row){return Number(row.uid)}) 
					self.friendIds.push(Number(FB.getSession().uid))
        })	
   },
   getNeighbors : function(){
     
   },
   sortAll: function(neighborsMap){
     var current_user_level = game.user.data.xp_info.xp_level
     for(var i=0;i<neighborsMap.length;i++){
       var neighbor = neighborsMap[i]
       totalWeight = 0;
       if(neighbor.friend) totalWeight+=this.friendWeight
       if(neighbor.attacked)totalWeight+=this.attackWeight*(neighbor.attacked+neighbor.defended)
       totalWeight-= Math.abs(neighbor.level-current_user_level)*this.levelWeight
       neighbor.weight = totalWeight
     }
      var  n = neighborsMap.length
      do{
        var newn = 0
        for (i = 0; i < n - 1; i++) {
          if (neighborsMap[i].weight > neighborsMap[i + 1].weight) {
            var tmp = neighborsMap[i];
            neighborsMap[i] = neighborsMap[i + 1]
            neighborsMap[i + 1] = tmp
            newn = i + 1
          }
        }
        n = newn
     }while(n > 1);
     return neighborsMap
   }  
})
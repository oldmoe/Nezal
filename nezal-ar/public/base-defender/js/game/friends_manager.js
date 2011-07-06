var FriendsManager = Class.create({
   //This should choose the suitable social network for the game
   friendIds : null,
   friendWeight : 100,
   attackWeight : 15,
   levelWeight : 35,
   global_map : null,
   initialize : function(game){
    this.game = game
    var self = this
    this.getFriends(function(){self.getNeighbors()})
   },
   getFriends :function(callback){
        var self = this
				var userID = FB.getSession().uid
				var	query = FB.Data.query("SELECT uid FROM user WHERE is_app_user=1 and uid IN (SELECT uid2 FROM friend WHERE uid1 = {0})", FB.getSession().uid);
				FB.Data.waitOn([query], function(){
					if(!query.value.length)query.value=[]
					self.friendIds = query.value.collect(function(row){return Number(row.uid)}) 
					self.friendIds.push(Number(FB.getSession().uid))
          if(callback)callback()
        })	
   },
   getNeighbors : function(){
     var self = this;
     this.game.network.globalMap(this.friendIds, function(users){
       self.global_map = users.map(function(x){return x.user_game_profile})
     });
     
   }
})
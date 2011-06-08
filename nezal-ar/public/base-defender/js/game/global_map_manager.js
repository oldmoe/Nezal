var GlobalMapManager = Class.create({
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
				userID = FB.getSession().uid
				var	query = FB.Data.query("SELECT uid FROM user WHERE is_app_user=1 and uid IN (SELECT uid2 FROM friend WHERE uid1 = {0})", FB.getSession().uid);
				FB.Data.waitOn([query], function(){
					if(!query.value.length)query.value=[]
					self.friendIds = query.value.collect(function(row){return Number(row.uid)}) 
					self.friendIds.push(Number(FB.getSession().uid))
          if(callback)callback()
        })	
   },
   getNeighbors : function(){
     this.globalMap = this.game.network.globalMap(this.friendIds)
     var ids = []
     var mapping = {}
     var self = this
     this.globalMap.each(function(user, index){
          mapping[user["service_id"]] = { "index" : index };
          ids[index]= user["service_id"]
        });
     serviceProvider.getUsersInfo(ids, mapping , function(){
          self.globalMap.each(function(user, i){
            if(mapping[user["service_id"]].name)
              user["name"] = mapping[user["service_id"]].name
            else
              user["name"] = user["service_id"]
          });
//          self.list_map()
        });
   },
   list_map : function(){
      $('neighborListDisplay').innerHTML = this.game.templatesManager.load("neighbor-list", {'neighbors' : this.globalMap});
      $('interaction').show()
      $('neighborListDisplay').show()   
   }
})
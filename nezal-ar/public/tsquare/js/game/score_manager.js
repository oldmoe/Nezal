var ScoreManager = Class.create({

  modes : {
    'global' : { display : '' },
    'friends' : { display : '' }
  }, 

  friends : null,

  topScorers : null,

  mode : null,

  /*
    gameMode can be one of the following values :
    - timeline 
    - racing
    - cooperation
    - global
  */
  gameMode : null,

  initialize : function(){
    /* This should be MOVED to initialize game part */
    this.network = new TSquareNetwork();    
    this.templateManager = new TemplatesManager(this.network);
  },

  loadFriendsTab : function(gameMode) {
    this.mode = 'friend'
    this.gameMode = gameMode;
    var self = this;
    socialEngine.friendsAppUsers(function(friends){  
      var friends = friends;
      var friendsIds =  friends.collect(function(friend){
                                    return friend.uid
                                });
      var callback = function(scores){
        self.friends = scores;
        self.sortFriends();
        self.display();
        self.fillSocialData(self.friends, friends);
      }
      self.network.friends(friendsIds, callback);
    });
  },

  loadGlobalTab : function(gameMode){
    this.mode = 'global'
    this.gameMode = gameMode;
    var self = this;
    var callback = function(result){
      self.topScorers = result;
      var ids = self.topScorers['top'].collect(function(user){return user['service_id']});
      socialEngine.getUsersInfo(ids, function(data){
        self.fillSocialData(self.topScorers['top'], data)
        self.display();  
      })
    }
    self.network.globalScores(gameMode, callback);
  },

  switchScoringMode : function(mode, gameMode) {
    
  },

  display : function() {
  },  

  sortFriends : function() {
    var self = this
    this.friends.sortBy(function(friend){return friend.scores[self.gameMode]})
  }, 

  fillSocialData : function(userList, socialData){
    console.log(userList, socialData);
    var socialDataHash = {};
    socialData.each(function(user){ socialDataHash[user.uid] = user });
    userList.each(function(user){
                         user.name = socialDataHash[user.service_id].name;
                         user.first_name = socialDataHash[user.service_id].first_name;
                         user.last_name = socialDataHash[user.service_id].last_name;
                         user.picture = socialDataHash[user.service_id].pic_square;
                      });
  }
  
})

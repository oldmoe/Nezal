var ScoreManager = Class.create({


  images : {
              'left' : 'images/tmp/left.png',
              'left-disabled' : 'images/tmp/left-disabled.png',
              'right' : 'images/tmp/right.png',
              'right-disabled' :'images/tmp/right-disabled.png'
            },

  modes : {
    'global' : { display : 'topScorers' },
    'friends' : { display : 'friends' }
  }, 

  gameModes : ['timeline', 'racing', 'cooperation', 'global'],

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
    this.mode = 'friends'
    this.gameMode = gameMode;
    var self = this;
    socialEngine.friendsAppUsers(function(friends){  
      var socialData = [];
      socialData = socialData.concat(friends);
      var friendsIds =  friends.collect(function(friend){
                                    return friend.uid
                                });
      var callback = function(scores){
        self.friends = scores;
        self.sortFriends();
        self.fillSocialData(self.friends, socialData);
        self.display();
        if(self.carousel) self.carousel.destroy();      
        self.carousel = new Carousel("friends", self.images, 2);
        var rank = 0;
        for(var i=0; i< self.friends.length; i++)
        {
          if(self.friends[i].service_id != socialEngine.userId())
            rank ++;
          else
            break;   
        }        
        self.carousel.scrollTo(rank);
        self.carousel.checkButtons();
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

  switchScoringMode : function(gameMode) {
    if(this.mode == 'global')
      this.loadFriendsTab(this.gameMode);
    else
      this.loadGlobalTab(this.gameMode);
  },

  display : function(){
    $('scores').innerHTML = this.templateManager.load('scoreTabs', { scoreManager : this}) + 
                 this.templateManager.load(this.modes[this.mode]['display'], { scoreManager : this});
    this.attachListeners();
  },

  attachListeners : function() {
    var self = this;
    $$('#scores .scoreTab').each( function(element) {
      if(element.id != self.mode)         
      {
        element.observe('click', function(event){
          self.switchScoringMode(self.gameMode);
        });
      } 
    });
    $$('#scores .gameModeTab').each( function(element) {
      element.observe('click', function(event){
        self.gameMode = element.id;
        if(self.mode == 'global')
        {
          self.loadGlobalTab(self.gameMode);      
        }
        else
        {
          self.sortFriends();
        } 
        self.display();
      });
    });
  },  

  sortFriends : function() {
    var self = this
    this.friends  = this.friends.sortBy(function(friend){ return friend.scores[self.gameMode]}).reverse();
  }, 

  fillSocialData : function(userList, socialData){
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

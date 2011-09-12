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
    var self = this;
    // Set green_notification field to true to users whom current user passed
    // Set red_notification field to true to users who passed current user
    if(self.mode == 'friends')
    {
      for(var i=0; i< this.friends.length; i++)
      {
        this.friends[i]['redNotification'] = false;
        this.friends[i]['greenNotification'] = false;
        if(this.friends[i].scores[this.gameMode] > this.currentUser.scores[this.gameMode] && 
            this.friends[i].scores.update_time[this.gameMode] > this.currentUser.last_read)
        {
          this.friends[i]['redNotification'] = true;
        }else if(this.currentUser && this.friends[i].scores[this.gameMode] < this.currentUser.scores[this.gameMode] && 
            this.friends[i].scores.update_time[this.gameMode] > this.currentUser.last_read)
        {
          this.friends[i]['greenNotification'] = true;
        }        
      }
    }
    $('scores').innerHTML = this.templateManager.load('scoreTabs', { scoreManager : this}) + 
                 this.templateManager.load(this.modes[this.mode]['display'], { scoreManager : this});
    if(self.mode == 'friends')
    {
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
    $$('#scores .greenNotification').each( function(element) {
      element.observe('click', function(event){
        var friend = self.friends.select(function(friend){return friend.service_id == element.id})[0];
        $('interaction').innerHTML = self.templateManager.load('sendChallengePrompt', { friend : friend,  scoreManager : self});
        $('interaction').show();
        self.attachPromptListeners();
      });
    });
    $$('#scores .redNotification').each( function(element) {
      element.observe('click', function(event){
        var friend = self.friends.select(function(friend){return friend.service_id == element.id})[0];
        $('interaction').innerHTML = self.templateManager.load('scorePassedAlert', { friend : friend,  scoreManager : self});
        $('interaction').show();
        self.attachPromptListeners();
      });
    });
  },  

  attachPromptListeners : function() {
    $$('#interaction .sendChallengCancel').each( function(element) {
      element.observe('click', function(event){
        $('interaction').hide();
        $$('#interaction .button').each(function(element){element.stopObserving('click')});
        $('interaction').innerHTML = '';
      });
    });
    $$('#interaction .scorePassedCancel').each( function(element) {
      element.observe('click', function(event){
        $('interaction').hide();
        $$('#interaction .button').each(function(element){element.stopObserving('click')});
        $('interaction').innerHTML = '';
      });
    });
    $$('#interaction .sendChallengOk').each( function(element) {
      element.observe('click', function(event){
        var sharable= {
          userId : element.id,
          picture : "http://www.flixya.com/files-photo/m/i/d/midosoft1962845.jpg",
          link : {
            url : "http://apps.facebook.com/thawragy/",
            caption : "New Battle Ahead",
            name : "Thawragy"
          },
          gameMessage : "Try to beat me!!!!",
          userMessage : "I just passed your score!! GAME ONN !!"
        }
        socialEngine.shareWithAll(sharable);
        $('interaction').hide();
      });
    });
  },

  sortFriends : function() {
    var self = this
    this.friends  = this.friends.sortBy(function(friend){ return friend.scores[self.gameMode]}).reverse();
  }, 

  /*
    Set currentUser field
    Megre the scoring data with the social data(name, picture) in one Aمحمود العسيلى مين انا rray 
  */
  fillSocialData : function(userList, socialData){
    var self = this;
    var socialDataHash = {};
    socialData.each(function(user){ socialDataHash[user.uid] = user });
    // Fill social data
    userList.each(function(user){
                    if(user.service_id == socialEngine.userId())  self.currentUser = user;
                    user.name = socialDataHash[user.service_id].name;
                    user.first_name = socialDataHash[user.service_id].first_name;
                    user.last_name = socialDataHash[user.service_id].last_name;
                    user.picture = socialDataHash[user.service_id].pic_square;
                  });
  }
  
})
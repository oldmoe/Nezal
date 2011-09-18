var ScoreManager = Class.create({


  images : {
              'left' : 'images/friends/previous_button.png',
              'left-disabled' : 'images/friends/previous_button.png',
              'right' : 'images/friends/next_button.png',
              'right-disabled' :'images/friends/next_button.png'
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

  initialize : function(game){
    /* This should be MOVED to initialize game part */
    this.network = game.network;    
    this.templateManager = game.templateManager;
    var self = this;
    new Loader().load([ {images : ["1.png", "2.png", "3.png", "first_button.png", "last_button.png", 'next_button.png', 'previous_button.png',
                                  "friend_box.png", "friends_bar.png", "friendsRank.png", "friendsScore.png", "functions_background.png",
                                  "home_icon.png", "menu_icon.png", "worldRank.png"], path: 'images/friends/', store: 'friends'}],
                      {
                        onFinish: function(){
                          self.loadFriendsTab('global');
                        }
                      });
//    this.openMarketplace();
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
      ids = ids.concat(self.topScorers['list'].collect(function(user){return user['service_id']}));
      socialEngine.getUsersInfo(ids, function(data){
        self.fillSocialData(self.topScorers['top'], data)
        self.fillSocialData(self.topScorers['list'], data)
        self.display();
      })
    }
    self.network.globalScores(gameMode, callback);
  },

  switchScoringMode : function(gameMode) {
    $('scoresInProgress').show();
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
    var params = {scoreManager:this};
    if(this.mode == 'friends')
    {
        params['topThree'] = this.friends.slice(0,1);
        params['list'] = this.friends
    }else
    {
        params['topThree'] = this.topScorers.top.slice(0,1);
        params['list'] = this.topScorers['list'];
    }
    $('scores').innerHTML = this.templateManager.load('friends', params);
    Game.addLoadedImagesToDiv('scores');
    if(self.carousel) self.carousel.destroy();      
    self.carousel = new Carousel("friends", self.images, 4);
    var rank = 0;
    for(var i=0; i< params['list'].length; i++)
    {
      if(params['list'][i].service_id != socialEngine.userId())
        rank ++;
      else
        break;   
    }
    self.carousel.scrollTo(rank);
    self.carousel.checkButtons();
    this.attachListeners();
    $('scoresInProgress').hide();
  },

  attachListeners : function() {
    var self = this;
    $$('#scores .swithcingTabs li').each( function(element) {
      if(element.hasClassName('selected') == false)         
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
            name : "Thawragy",
            url : "http://apps.facebook.com/thawragy/",
            caption : "New Battle Ahead",
            description : "Try to beat me!!!!"
          },
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
    Megre the scoring data with the social data(name, picture) in one Array 
  */
  fillSocialData : function(userList, socialData){
    var self = this;
    var socialDataHash = {};
    socialData.each(function(user){ socialDataHash[user.uid] = user });
    // Fill social data
    var invalid = [];
    userList.each(function(user, index){
                    if(user.service_id == socialEngine.userId())  self.currentUser = user;
                    if(socialDataHash[user.service_id])
                    {
                      user.name = socialDataHash[user.service_id].name;
                      user.first_name = socialDataHash[user.service_id].first_name;
                      user.last_name = socialDataHash[user.service_id].last_name;
                      user.picture = socialDataHash[user.service_id].pic_square;
                      user.url = socialDataHash[user.service_id].profile_url;
                    }else{
                      invalid.push(index);
                    }
                  });
    invalid.each(function(index){
      userList.splice(index, 1);
    });
  }
  
})

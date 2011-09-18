var SocialEngine = Class.create(FBConnect, {

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
  },

  inviteFriends : function(){
    socialEngine.requestFromNoneAppUsers({'title' :'Invite your friends', 'message':'Revolt with me !!!'}, function(){});
  }
  
});

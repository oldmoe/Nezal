FBDefender = {
    
    imagesUrl : 'http://studio.nezal.com/fb-games/city-defender/images/',
    
    gameName : function(){
      return Text.gameName;  
    },
    
    isMarket : false,
    
    
    invite : function(){
       FBConnect.invite(Text.facebook.invite.inviteMsg, Text.facebook.invite.userPrompt, FBDefender.gameName() );
    },
    
    bookmark : function(){
        FBConnect.bookmark(function(){
                  new Ajax.Request(  'users/bookmark' ,
                  {   method:'post', 
                      onSuccess : function(t, json){
                          var data = JSON.parse(t.responseText);
                          var oldCoins = Intro.userData.coins
                          Intro.userData.coins = data['user_data'].coins;
                          if(oldCoins != data['user_data'].coins)
                          {
                              Intro.userData.bookmarked = true;
                              Intro.showBookmarkCongrates();
							  Intro.processPlayerProgress()
                          }
                          if(Intro.currentPage == Intro.pages['marketPlace'].index && FBDefender.isMarket==true)
                              Intro.select('marketPlace');
                      }
                  });
        });
    },
	
	subscribe : function(){
        FBConnect.subscribe(function(){
                  new Ajax.Request(  'users/subscribe' ,
                  {   method:'post', 
                      onSuccess : function(t, json){
                          var data = JSON.parse(t.responseText);
                          var oldCoins = Intro.userData.coins
                          Intro.userData.coins = data['user_data'].coins;
                          if(oldCoins != data['user_data'].coins)
                          {
                              Intro.userData.subscribed = true;
                              Intro.showSubscribeCongrates();
							  Intro.processPlayerProgress()
                          }
                          if(Intro.currentPage == Intro.pages['marketPlace'].index && FBDefender.isMarket==true)
                              Intro.select('marketPlace');
                      }
                  });
        });
	},
    
    isFan : function(){
        FBConnect.isFan(function(status){
                  if(status && status.page_id)
                  {
                      new Ajax.Request(  'users/like' ,
                      {   method:'post', 
                          onSuccess : function(t, json){
                              var data = JSON.parse(t.responseText);
                              var oldCoins = Intro.userData.coins
                              Intro.userData.coins = data['user_data'].coins;
                              if(oldCoins != data['user_data'].coins)
                              {
                                  Intro.userData.like = true;
                                  Intro.showLikeCongrates();
								  Intro.processPlayerProgress()
                              }
                              if(Intro.currentPage == Intro.pages['marketPlace'].index && FBDefender.isMarket==true)
                                  Intro.select('marketPlace');
                          }
                      });
                  }
        });
    },
    
    onPublishSuccess : function(){
		/*
        new Ajax.Request(  'users/coins' ,
        {   method:'post', 
            parameters: { 'coins' : 5 },
            onSuccess : function(t, json){
                var data = JSON.parse(t.responseText);
                Intro.userData.coins = data['user_data'].coins;
                if(Intro.currentPage == Intro.pages['marketPlace'].index && FBDefender.isMarket==true)
                    Intro.select('marketPlace');
            }
        });
		*/
    },

    publishMissionCompletion : function(mission){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name + " " + Text.facebook.completeMession[0] + " " +
                                     Intro.campaignData.missionsInfo[mission.name]['name'].toUpperCase() + " " +
                                     Text.facebook.completeMession[1] +" " +
                                     FBDefender.gameName(),
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl+ 'facebook/medal.png',
                            	            'href': loc }],
                              caption: FBConnect.user.first_name + Text.facebook.completeMession[2] +
                                       " " +Text.facebook.completeMession[3] +
                                        " " +mission.score +  Text.facebook.completeMession[4]
                  };
                  var actionLinks = [ {text: FBDefender.gameName(), href: loc } ];
                  FBDefender.isMarket = false;
                  FBConnect.publish(attachment, Text.facebook.userPrompt, actionLinks, FBDefender.onPublishSuccess)
        } );  
    },

    publishCampaignCompletion : function(campaign){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name + " " + Text.facebook.completeCampaign[0] + " " +
                                     Intro.campaignData.campaignInfo['name'].toUpperCase() + " " +
                                     Text.facebook.completeCampaign[1] + " " +
                                     FBDefender.gameName(),
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl + 'facebook/medal.png',
                            	            'href': loc }],
                              caption: FBConnect.user.first_name + " " + Text.facebook.completeCampaign[2] + " " +
                                      campaign.name.toUpperCase() +" " + Text.facebook.completeCampaign[3] + " " +
                                      campaign.score + " " + Text.facebook.completeCampaign[4]
                  };
                  var actionLinks = [ {text: FBDefender.gameName(), href: loc } ];
                  FBDefender.isMarket = false;
                  FBConnect.publish(attachment, Text.facebook.userPrompt , actionLinks, FBDefender.onPublishSuccess)
        } );  
    },
      
    publishRankPromotion : function(info){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name + " " + Text.facebook.rankPromotion[0] + " " +
                                     Text.game.ranks[info.name]['name'] + " " + Text.facebook.rankPromotion[1] + " " +
                                     FBDefender.gameName(),
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl + 'facebook/ranks/' +info.image,
                            	            'href': loc }],
                              caption: Text.facebook.rankPromotion[2] + " " +
                                        FBDefender.gameName() + ", " + 
                                        FBConnect.user.first_name + " " + Text.facebook.rankPromotion[3] + " " +
                                        Text.game.ranks[info.name]['name'] +
                                        " " + Text.facebook.rankPromotion[4]
                  };
                  var actionLinks = [ {text: FBDefender.gameName(), href: loc } ];
                  FBDefender.isMarket = false;
                  FBConnect.publish(attachment, Text.facebook.userPrompt , actionLinks, FBDefender.onPublishSuccess)
        } );  
    },
    
    publishUnlockedItem : function(info){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name +" " + Text.facebook.unlockItem[0] + " " +
                                     Text.intro[info.type][info.name]['name'] + " " + Text[info.type] +
                                     " " + Text.facebook.unlockItem[1] + " " + FBDefender.gameName(),
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl + info.image,
                            	            'href': loc }],
                              caption: FBConnect.user.first_name + " " + Text.facebook.unlockItem[2] + " " +
                                      Text.intro[info.type][info.name]['name'] + " " + Text[info.type] +
                                      " " + Text.facebook.unlockItem[3]
                  };
                  var actionLinks = [ {text: FBDefender.gameName(), href: loc } ];
                  FBDefender.isMarket = true;
                  FBConnect.publish(attachment, Text.facebook.userPrompt , actionLinks, FBDefender.onPublishSuccess)
        } );  
    },

    publishUpgradedItem : function(info){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name +" " + Text.facebook.upgradeItem[0] + " " +
                                     Text.intro[info.type][info.name]['name'] + " " + Text[info.type] +
                                     " " + Text.facebook.upgradeItem[1] + " " + FBDefender.gameName(),
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl + info.image,
                            	            'href': loc }],
                              caption: FBConnect.user.first_name + " " + Text.facebook.upgradeItem[2] + " " +
                                      Text.intro[info.type][info.name]['name'] + " " + Text[info.type] +
                                      " " + Text.facebook.upgradeItem[3]
                  };
                  var actionLinks = [ {text: FBDefender.gameName(), href: loc } ];
                  FBDefender.isMarket = true;
                  FBConnect.publish(attachment, Text.facebook.userPrompt , actionLinks, FBDefender.onPublishSuccess)
        } );  
    },

    publishCampaignRanking : function(info){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name + " " + Text.facebook.campaignRanking[0] + " " +
                                      info.ranking + " " + Text.facebook.campaignRanking[1] + " " +
                                      info.rankingGlobal + " " + Text.facebook.campaignRanking[2] + " " +
                                      " " + Text.facebook.campaignRanking[3] + " " +
                                      FBDefender.gameName(),
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl + 'facebook/medal.png',
                            	            'href': loc }],
                              caption: FBConnect.user.first_name + " " + Text.facebook.campaignRanking[4] + " " +
                                      info.ranking + " " + Text.facebook.campaignRanking[5] + " " +
                                      info.rankingGlobal + " " + Text.facebook.campaignRanking[6] + " " +
                                      info.campaignName.toUpperCase() + " " + Text.facebook.campaignRanking[6] + " "
                  };
                  var actionLinks = [ {text: FBDefender.gameName(), href: loc } ];
                  FBDefender.isMarket = false;
                  FBConnect.publish(attachment, Text.facebook.userPrompt, actionLinks, FBDefender.onPublishSuccess)
        } );
    },
	publishSnapshot : function(img){
			
		var post = ""
		post += "--kkkk\r\nContent-Disposition: form-data; name=\"file\"; filename=\"file1.png\"\r\n"
		post += "Content-Type: image/png\r\n"
		post += "Content-Transfer-Encoding: base64\r\n\r\n"
		post += img
		var request = {
			'Content-type' : "multipart/form-data; boundary=--kkkk",
			body : post
		}
		var values = {message:'the caption',filename:'image.png',image:img}
		FB.api('/'+FBConnect.session.uid+'/photos?access_token='+FBConnect.session.access_token,function(){alert(1)},values,'post')
		//FB.api('/'+FBConnect.session.uid+'/photos',function(){alert(1)},values,'post')
    }
	
  
}

FBDefender = {
    
    imagesUrl : 'http://studio.nezal.com:5500/fb-games/city-defender/images/',
    
    gameName : " Arab Warriors",

    publishMissionCompletion : function(mission){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name + " courageously defends " +
                                     mission.name.toUpperCase() + " at " + FBDefender.gameName,
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl+ 'facebook/medal.png',
                            	            'href': loc }],
                              caption: FBConnect.user.first_name + " heroic efforts defended the city and scored "+
                                      mission.score +  ". Can you top such efforts?"
                  };
                  var actionLinks = [ {text: FBDefender.gameName, href: loc } ];
                  FBConnect.publish(attachment, "Tell your friends about your accomplishment" , actionLinks)
        } );  
    },

    publishCampaignCompletion : function(campaign){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name + " with a legendary defense to save " +
                                     campaign.name.toUpperCase() + " at " + FBDefender.gameName,
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl + 'facebook/medal.png',
                            	            'href': loc }],
                              caption: FBConnect.user.first_name + " shows bullet proof defense on the way to save " +
                                      campaign.name.toUpperCase() + " & nails " +
                                      campaign.score +  " points through out the journey. Can you out play that?"
                  };
                  var actionLinks = [ {text: FBDefender.gameName, href: loc } ];
                  FBConnect.publish(attachment, "Tell your friends about your accomplishment" , actionLinks)
        } );  
    },
      
    publishRankPromotion : function(info){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name + " promoted to become " +
                                     info.name.toUpperCase() + " at " + FBDefender.gameName,
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl + 'facebook/ranks/' +info.image,
                            	            'href': loc }],
                              caption: "In recognition of such outstanding defending skills at " + 
                                        FBDefender.gameName + ", " + 
                                        FBConnect.user.first_name + " has been promoted to become " +
                                        info.name +
                                      ". Salute is in due to such brave efforts."
                  };
                  var actionLinks = [ {text: FBDefender.gameName, href: loc } ];
                  FBConnect.publish(attachment, "Tell your friends about your accomplishment" , actionLinks)
        } );  
    },
    
    publishUnlockedItem : function(info){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name + " unlocks the " +
                                     info.name + " " +info.type + " at " + FBDefender.gameName,
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl + info.image,
                            	            'href': loc }],
                              caption: FBConnect.user.first_name + " unlocked the " +
                                      info.name + " " +info.type +
                                      " to gain massive tactical advantage on the battle to save " +
                                      info.mission.toUpperCase() + "."
                  };
                  var actionLinks = [ {text: FBDefender.gameName, href: loc } ];
                  FBConnect.publish(attachment, "Tell your friends about your accomplishment" , actionLinks)
        } );  
    },

    publishCampaignRanking : function(info){
        FBConnect.getUserInfo( function(){
                  var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
                  var attachment =  {
                              name : FBConnect.user.first_name + " finishes " + 
                                      info.ranking + " among friends while defending " +
                                     info.campaignName.toUpperCase() + " at " + FBDefender.gameName,
                              href : loc,
                            	'media': [{ 'type': 'image', 
                            	            'src': FBDefender.imagesUrl + 'facebook/medal.png',
                            	            'href': loc }],
                              caption: FBConnect.user.first_name + " defense along the march to save " +
                                      info.campaignName.toUpperCase() + " earned the " +
                                      info.ranking +  
                                      " position among fellow warriors. Dare to challange their efforts?"
                  };
                  var actionLinks = [ {text: FBDefender.gameName, href: loc } ];
                  FBConnect.publish(attachment, "Tell your friends about your accomplishment" , actionLinks)
        } );
    }
  
}
